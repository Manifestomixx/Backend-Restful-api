const USER = require('../model/userModel');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Get user by ID
const getSingleUser = async (req, res) => {
    const { userId } = req.user; 
    try {
        let user = await USER.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await USER.find().select("-password");
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }

    const { userId } = req.user;
    const { age, gender } = req.body;
    let profileImage;

    try {
        // Check if profile image is uploaded
        if (req.files && req.files.profileImage) {
            const result = await cloudinary.uploader.upload(
                req.files.profileImage.tempFilePath,
                { folder: "profileImage", width: 300, height: 300, crop: "fit" }
            );

            // Ensure upload was successful
            if (result && result.secure_url) {
                profileImage = result.secure_url;
                console.log("Profile picture URL:", profileImage);

                // Remove uploaded file from server
                fs.unlinkSync(req.files.profileImage.tempFilePath);
            } else {
                console.error("Cloudinary upload failed");
                return res.status(500).json({ success: false, message: "Profile image upload failed" });
            }
        }

        const updatedUserData = { age, gender };
        if (profileImage) {
            updatedUserData.profileImage = profileImage;
        }


        // Find a user and update profile
        const updatedUser = await USER.findByIdAndUpdate(
            userId,
            { $set: updatedUserData },
            { new: true, runValidators: true, context: "query" }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile", error);
        if (req.files && req.files.profileImage) {
            fs.unlinkSync(req.files.profileImage.tempFilePath);
        }
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};


module.exports = {
    getSingleUser,
    getAllUsers,
    updateUserProfile,
};
