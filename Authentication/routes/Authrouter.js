const express = require('express');
const router = express.Router();
const verifyToken = require('../authmiddlewares/jwtMiddlewrae')
const dashboardController = require('../Controllers/dashboard');

const { registerUser, generateOtp ,login} = require('../Controllers/usercontroller');
const{ hashPassword} = require('../authmiddlewares/middlware')

router.post("/logout", verifyToken, dashboardController.logout);
router.post('/signup', hashPassword, registerUser);
router.post('/generateotp', generateOtp)
router.post('/login',hashPassword,login)


module.exports = router; 
