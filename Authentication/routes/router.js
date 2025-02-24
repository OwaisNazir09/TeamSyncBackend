const express = require('express');
const router = express.Router();

const { registerUser, generateOtp } = require('../Controllers/usercontroller');
// const validateUser = require('../authmiddlewares/middlware')

router.post('/signup', registerUser);
router.post('/generateotp', generateOtp)


module.exports = router; 
