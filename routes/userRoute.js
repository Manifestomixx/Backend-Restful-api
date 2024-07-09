const express = require("express");
const router = express.Router();
const {getSingleUser,getAllUsers,updateUserProfile} = require('../controller/userController');
const authMiddleware = require("../middleware/auth");
const { forgotPassword } = require("../controller/authController");


// single user
router.get("/userprofile/:userId",authMiddleware,getSingleUser);

// all users
router.get("/all",getAllUsers);

// update users
router.put("/update-profile",authMiddleware, updateUserProfile);



module.exports = router