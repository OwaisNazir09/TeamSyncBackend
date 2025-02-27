const express = require("express");
const verifyToken = require("../authmiddlewares/jwtMiddlewrae");
const { getTeamDetails,addMember, createTeam } = require("../Controllers/teamController");

const router = express.Router();

router.get("/team", verifyToken, getTeamDetails);
router.post("/team/create", verifyToken, createTeam);
router.post("/addMember", verifyToken, addMember);

module.exports = router;
