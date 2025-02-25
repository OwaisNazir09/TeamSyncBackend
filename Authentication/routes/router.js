const express = require('express');
const router = express.Router();

const { registerUser, generateOtp ,login} = require('../Controllers/usercontroller');
const{ hashPassword} = require('../authmiddlewares/middlware')

router.post('/signup', hashPassword, registerUser);
router.post('/generateotp', generateOtp)
router.post('/login',hashPassword,login)


module.exports = router; 
