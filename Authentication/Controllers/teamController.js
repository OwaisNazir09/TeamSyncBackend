const User = require("../model/user");
const Team = require("../model/team");

const getTeamDetails = async (req, res) => {
    try {
        const email = req.user?.email;

        if (!email) {
            return res.status(401).json({ status: "failed", message: "Unauthorized - No email found in token" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        let team = await Team.findOne({ owner: user._id }).populate("members");

        if (!team) {
            return res.status(200).json({
                message: "No team found. Create one!",
                hasTeam: false
            });
        }

        return res.status(200).json({
            hasTeam: true,
            teamDetails: team
        });

    } catch (error) {
        console.error("Error fetching team details:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};


const createTeam = async (req, res) => {
    try {
        const { teamName } = req.body;
        const email = req.user?.email;

        if (!email) {
            return res.status(401).json({ status: "failed", message: "Unauthorized - No email found in token" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        // Check if the user already owns a team
        const existingTeam = await Team.findOne({ owner: user._id });
        if (existingTeam) {
            return res.status(400).json({ status: "failed", message: "You already own a team." });
        }

        const newTeam = new Team({
            name: teamName,
            owner: user._id,
            members: [user._id]
        });

        await newTeam.save();

        return res.status(201).json({
            message: "Team created successfully!",
            team: newTeam
        });

    } catch (error) {
        console.error("Error creating team:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};


const addMember = async (req, res) => {
    try {
        const { teamId, memberEmail } = req.body;
        const email = req.user?.email; // Get the email from token

        if (!email) {
            return res.status(401).json({ status: "failed", message: "Unauthorized - No email found in token" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ status: "failed", message: "Team not found" });
        }

        // Check if the requester is the owner
        if (team.owner.toString() !== user._id.toString()) {
            return res.status(403).json({ status: "failed", message: "Only the team owner can add members" });
        }

        // Find the user to add
        const member = await User.findOne({ email: memberEmail });
        if (!member) {
            return res.status(404).json({ status: "failed", message: "Member not found" });
        }

        // Check if the user is already in the team
        if (team.members.includes(member._id)) {
            return res.status(400).json({ status: "failed", message: "Member is already in the team" });
        }

        // Add member and save
        team.members.push(member._id);
        await team.save();

        return res.status(200).json({
            message: "Member added successfully!",
            team
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};


module.exports = { getTeamDetails, createTeam, addMember };
