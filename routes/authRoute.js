const express = require('express');
const router = express.Router();
const {registration,login,getUserName,isLoggedIn, forgotPassword,resetPassword} = require('../controller/authController')
const authMiddleware = require('../middleware/auth');


// registration
router.post('/register',registration);

// login
router.post('/login',login);

// get username
router.get('/username',authMiddleware,getUserName);

// isLoggedIn
router.get('/isloggedin',isLoggedIn);

// forgot password
router.post("/forgot-password",authMiddleware, forgotPassword);

// reset password ftn
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;

