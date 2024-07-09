const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true,"Firstname is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true,"Lastname is required"],
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: [true,"username already in use"],
        index: true
    },
    email: {
        type: String,
        required: [true,"Email address is required"],
        trim: true,
        unique: [true,"Email already exist"],
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        trim: true,
        minlength:[8,"Minimum password length must be eight characters"]

    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},{timestamps:true});


// hashing password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next()
})

// Generate JWT token
userSchema.methods.generateToken = function () {
    let token = jwt.sign({ userId: this._id, userName: this.userName }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    return token;
};


// compare password
userSchema.methods.comparePassword = async function(userPassword){
    const isCorrect = await bcrypt.compare(userPassword,this.password);
    return isCorrect;
};

// generating reset password
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
  };




  const USER = mongoose.model('User',userSchema);
  module.exports = USER;

