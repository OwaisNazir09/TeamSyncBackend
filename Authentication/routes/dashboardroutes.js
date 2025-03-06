const express = require("express");
const verifyToken = require('../authmiddlewares/jwtMiddlewrae')
const dashboardController = require('../Controllers/dashboard');

const router = express.Router();

router.get("/dashboardstats", verifyToken, dashboardController.usedashboard);
router.post("/createnote", verifyToken, dashboardController.createnote);
router.delete("/deletenote", verifyToken, dashboardController.deletenote);
router.put("/updatetask", verifyToken, dashboardController.updatetask);

// Attendance Routes
router.put("/startattendance", verifyToken, dashboardController.startAttendance);
router.put("/startbreak", verifyToken, dashboardController.startBreak);
router.put("/endbreak", verifyToken, dashboardController.endBreak);
router.put("/endattendance", verifyToken, dashboardController.endAttendance);

//for User
router.get("/user/profilestats", verifyToken, dashboardController.profilestats);
router.put("/user/update-profile", verifyToken, dashboardController.updateUser);
router.put("/user/update-employment", verifyToken, dashboardController.updateEmployment);
router.put("/user/update-contact", verifyToken, dashboardController.updateContact);



module.exports = router;
