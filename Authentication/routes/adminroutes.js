const express = require("express");
const verifyToken = require('../authmiddlewares/jwtMiddlewrae');
const { isAdmin } = require('../authmiddlewares/middlware');
const adminController = require('../Controllers/adminController/admincontroller');

const router = express.Router();


router.get("/dashboard", verifyToken, isAdmin, adminController.getAdminDashboard);


router.post("/createtask", verifyToken, isAdmin, adminController.createtask);
router.delete("/deletetask", verifyToken, isAdmin, adminController.deleteTask);
router.put("/updatetask", verifyToken, isAdmin, adminController.updateTask);
router.get("/viewtasks", verifyToken, isAdmin, adminController.viewTasks);


router.post("/createnotice", verifyToken, isAdmin, adminController.createnotice);
router.get("/notices", verifyToken, isAdmin, adminController.getNoticesWithTeams);
router.delete('/deletenotice', verifyToken, isAdmin, adminController.deleteNotice);

router.post("/createteam", verifyToken, isAdmin, adminController.createTeam);
router.delete("/deleteteam", verifyToken, isAdmin, adminController.deleteTeam);
router.post("/team/addUser", verifyToken, isAdmin, adminController.addUserToTeam);
router.delete("/team/deleteUser", verifyToken, isAdmin, adminController.removeUserFromTeam);
router.get("/teamdetails", verifyToken, adminController.getTeamDetails);



module.exports = router;
