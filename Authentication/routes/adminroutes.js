const express = require("express");
const verifyToken = require('../authmiddlewares/jwtMiddlewrae');
const { isAdmin } = require('../authmiddlewares/middlware');
const adminController = require('../Controllers/adminController/admincontroller');

const router = express.Router();

router.post("/createtask", verifyToken, isAdmin, adminController.createtask);
router.post("/createnotice", verifyToken, isAdmin, adminController.createnotice);
router.put("/updatetask", verifyToken, isAdmin, adminController.updateTask);
router.delete("/deletetask", verifyToken, isAdmin, adminController.deleteTask);

router.post("/createteam", verifyToken, isAdmin, adminController.createTeam);
router.delete("/deleteteam", verifyToken, isAdmin, adminController.deleteTeam);
router.post("/team/addUser", verifyToken, isAdmin, adminController.addUserToTeam);
router.delete("/team/deleteUser", verifyToken, isAdmin, adminController.removeUserFromTeam );
router.get("/teamdetails", verifyToken, adminController.getTeamDetails);



// router.get("/adminstats", verifyToken, isAdmin, adminController.getAdminStats);

module.exports = router;
