const express = require('express');
const router = express.Router();
const { registerUser } = require('../Controllers/usercontroller');
const validateUser = require('../authmiddlewares/middlware')

router.post('/register', validateUser, registerUser);

module.exports = router; 
