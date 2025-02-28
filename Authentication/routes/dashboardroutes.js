const express = require('express');
const verifyToken = require('../authmiddlewares/jwtMiddlewrae')
const { usedashboard, createnote,deletenote } = require('../Controllers/dashboard');
const router = express.Router();


router.get('/dashboardstats', verifyToken, usedashboard);
router.post('/createnote', verifyToken, createnote)
router.delete('/deletenote', verifyToken, deletenote)

module.exports = router;
