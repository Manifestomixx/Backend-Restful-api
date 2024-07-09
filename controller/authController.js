const USER = require('../model/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require("../middleware/sendMail"); 
const crypto = require("crypto");

// Registration
const registration = async (req, res) => {
    try {
        const { firstName,lastName, email, password, confirmPassword, userName } = req.body;
        if (!firstName || !lastName || !email || !password || !confirmPassword || !userName) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password does not match" });
        }

        // Check for existing email
        const existingEmail = await USER.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Check for existing username
        const existingUsername = await USER.findOne({ userName });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const user = await USER.create({ ...req.body });
        res.status(201).json({ success: true, message: "Registration successful", user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get username to update on website
const getUserName = async (req, res) => {
  try {
      const { userId } = req.user;
      const user = await USER.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, userName: user.userName });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        // Finding registered email
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email does not exist" });
        }

        // Compare and validate password
        const auth = await user.comparePassword(password);
        if (!auth) {
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }

        // Generate token for sign in
        const token = await user.generateToken();
        console.log(token);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { userName: user.userName, email: user.email, token }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// isLoggedIn function
const isLoggedIn = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.json(false);
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.json(false);
        }
        jwt.verify(token, process.env.JWT_SECRET);
        res.json(true);
    } catch (error) {
        console.log(error.message);
        res.json(false);
    }
};

// forgot password ftn
const forgotPassword = async (req, res,next) => {
  const { email } = req.body;
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "email not found" });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:5119/resetpassword/${resetToken}`;
    const message = `<h1>You have requested for a password reset </h1> <p>Please go to this link to reset your password</p> <a href=${resetUrl} clicktracking = off> ${resetUrl} </a> `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).json({success:true,data:"Email sent"})
    } catch (error) {
      user.getResetPasswordToken = undefined;
      user.getResetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email couldnt be sent", error });
    }
  } catch (error) {
    res.json(error.message);
  }
};

// reset password ftn
const resetPassword = async (req,res)=>{
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
  try {
    const user = await USER.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}

    })
    if(!user){
      return res.status(400).json({status:false,message:"invalid Reset Token"})
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({success:true,message:"Password Reset Successfull"})
    
  } catch (error) {
    res.status(500).json(error.message)
    
  }
}

module.exports = { registration, login, isLoggedIn, getUserName, resetPassword ,forgotPassword};
