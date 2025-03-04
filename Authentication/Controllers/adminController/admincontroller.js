const User = require("../../model/user");
const Team = require("../../model/team");
const admin = require("../../services/admin.services");
const Notices = require("../../model/notices");
const createtask = async (req, res) => {
    try {
        const { email, title, taskstatus, dueDate } = req.body;

        if (!email) {
            return res.status(400).json({ status: "failed", message: "Email is required" });
        }
        if (!title || !taskstatus || !dueDate) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        const assignedTouser = user._id;

        const createdTask = await admin.createtask({ email, title, assignedTo: assignedTouser, taskstatus, dueDate });

        if (createdTask.status === "success") {
            return res.status(201).json({ status: "success", task: createdTask.task });
        }

        return res.status(500).json({ status: "failed", message: "Task creation failed" });

    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ status: "failed", message: "Task ID is required" });
        }

        const deletedTask = await admin.deleteTask(taskId);

        if (deletedTask.status === "success") {
            return res.status(200).json({ status: "success", message: "Task deleted successfully" });
        }

        return res.status(500).json({ status: "failed", message: "Task deletion failed" });

    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, taskstatus, dueDate } = req.body;

        if (!taskId) {
            return res.status(400).json({ status: "failed", message: "Task ID is required" });
        }

        const updatedTask = await admin.updateTask(taskId, { title, taskstatus, dueDate });

        if (updatedTask.status === "success") {
            return res.status(200).json({ status: "success", task: updatedTask.task });
        }

        return res.status(500).json({ status: "failed", message: "Task update failed" });

    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};


const createnotice = async (req, res) => {
    try {
        const { email, title, description, teamId} = req.body;

        if (!email) {
            return res.status(400).json({ status: "failed", message: "Email is required" });
        }
        if (!title || !description || !teamId) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        const createdBy = user._id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ status: "failed", message: "Team not found" });
        }

        const createdNotice = await admin.createNotice({ title, description, createdBy, team: teamId });

        if (createdNotice.status === "success") {
            return res.status(201).json({ status: "success", notice: createdNotice.notice });
        }

        return res.status(500).json({ status: "failed", message: "Notice creation failed" });

    } catch (error) {
        console.error("Error creating notice:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};

const deleteNotice = async (req, res) => {
    try {
        const { noticeId } = req.params;

        if (!noticeId) {
            return res.status(400).json({ status: "failed", message: "Notice ID is required" });
        }

        const deletedNotice = await admin.deleteNotice(noticeId);

        if (deletedNotice.status === "success") {
            return res.status(200).json({ status: "success", message: "Notice deleted successfully" });
        }

        return res.status(500).json({ status: "failed", message: "Notice deletion failed" });

    } catch (error) {
        console.error("Error deleting notice:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};
const createTeam = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const createdBy = req.user.userId;

        if (!name) {
            return res.status(400).json({ status: "failed", message: "Team name is required" });
        }

        const createdTeam = await admin.createTeam({ name, description, members, createdBy });

        if (createdTeam.status === "success") {
            return res.status(201).json({ status: "success", team: createdTeam.team });
        }

        return res.status(500).json({ status: "failed", message: "Team creation failed" });
    } catch (error) {
        console.error("Error creating team:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};
const deleteTeam = async (req, res) => {
    try {
        const adminId = req.user.userId; 
        
        const team = await admin.findTeamByAdmin(adminId);
        
        if (!team) {
            return res.status(404).json({ status: "failed", message: "No team found for this admin" });
        }

        const deletedTeam = await admin.deleteTeam(team._id);

        return res.status(200).json({ status: "success", message: "Team deleted successfully",deletedTeam });
    } catch (error) {
        console.error("Error deleting team:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};


const addUserToTeam = async (req, res) => {
    try {
        const { userEmails } = req.body;
        const userId = req.user.userId; 

        const team = await Team.findOne({ createdBy: userId });

        if (!team) {
            return res.status(404).json({ status: "failed", message: "No team found for this user" });
        }

        const userRecords = await User.find({ email: { $in: userEmails } }).select("_id");
        const userIds = userRecords.map(user => user._id);

        if (userIds.length === 0) {
            return res.status(404).json({ status: "failed", message: "No users found with these emails" });
        }

        const updatedTeam = await admin.addUserToTeam(team._id, userIds);

        return res.status(200).json({
            status: "success",
            message: "Users added to the team successfully",
            updatedTeam,
        });
    } catch (error) {
        console.error("Error adding users to team:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};
const removeUserFromTeam = async (req, res) => {
    try {
        const { userEmails } = req.body;
        const userId = req.user.userId;

        const team = await Team.findOne({ createdBy: userId });

        if (!team) {
            return res.status(404).json({ status: "failed", message: "No team found for this user" });
        }

        const userRecords = await User.find({ email: { $in: userEmails } }).select("_id");
        const userIds = userRecords.map(user => user._id);

        if (userIds.length === 0) {
            return res.status(404).json({ status: "failed", message: "No users found with these emails" });
        }

        const updatedTeam = await admin.removeUserFromTeam(team._id, userIds);

        return res.status(200).json({
            status: "success",
            message: "Users removed from the team successfully",
            updatedTeam,
        });
    } catch (error) {
        console.error("Error removing users from team:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};

const getTeamDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const team = await admin.getTeamDetails(userId);

        if (!team) {
            return res.status(404).json({ message: "No team found for this user." });
        }

        res.status(200).json(team);
    } catch (error) {
        console.error("Error fetching team details:", error);
        res.status(500).json({ message: "Server error." });
    }
};



module.exports = { createtask, createTeam, getTeamDetails, deleteTeam, createnotice, deleteNotice, deleteTask, updateTask, addUserToTeam, removeUserFromTeam };
