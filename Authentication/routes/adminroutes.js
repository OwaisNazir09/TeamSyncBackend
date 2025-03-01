const express = require('express');
const verifyToken = require('../authmiddlewares/jwtMiddlewrae')
const { isAdmin } = require('../authmiddlewares/middlware')
const { createtask, createnotice } = require('../Controllers/adminController/admincontroller');
const router = express.Router();

router.post('/createtask', verifyToken, isAdmin, createtask);

router.post('/createnotice', verifyToken, isAdmin, createnotice);

module.exports = router;