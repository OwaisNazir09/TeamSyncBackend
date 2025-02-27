const express = require('express');
const verifyToken = require('../authmiddlewares/jwtMiddlewrae')
const { createtask } = require('../Controllers/adminController/admincontroller');
const router = express.Router();

router.post('/createtask', verifyToken, createtask);

module.exports = router;