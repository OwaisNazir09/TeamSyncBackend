const User = require("../../model/user");
const Team = require("../../model/team");
const admin = require("../../services/admin.services");
const Notices = require("../../model/notices");
const createtask = async (req, res) => {
    try {
        const { assignedTo, title, taskstatus, dueDate } = req.body;

        if (!assignedTo) {
            return res.status(400).json({ status: "failed", message: "assignedTo is required" });
        }
        if (!title || !taskstatus || !dueDate) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }


        const createdTask = await admin.createtask({ title, assignedTo, taskstatus, dueDate });

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
        const { taskId } = req.body;

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
        const { taskId, title, taskstatus, dueDate } = req.body;

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

const viewTasks = async (req, res) => {
    try {
        const adminId = req.user.userId;

        const tasks = await admin.getTeamTasks(adminId);

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const createnotice = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.userId;

        if (!title || !description) {
            return res.status(400).json({ status: "failed", message: "Title and description are required" });
        }

        const team = await Team.findOne({ createdBy: userId });

        if (!team) {
            return res.status(404).json({ status: "failed", message: "Team not found for this admin" });
        }

        const createdNotice = await admin.createNotice({
            title,
            description,
            createdBy: userId,
            team: team._id
        });

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
        const { id: noticeId } = req.body;
        console.log("Deleting notice with ID:", noticeId);


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

        return res.status(200).json({ status: "success", message: "Team deleted successfully", deletedTeam });
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
const getNoticesWithTeams = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notices = await admin.getNoticesWithTeams(userId);

        return res.status(200).json({ status: "success", notices });
    } catch (error) {
        console.error("Error fetching notices:", error);
        return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};
const getAdminDashboard = async (req, res) => {
    try {
        const email = req.user?.email;
        console.log("Received admin dashboard request for email:", email);

        if (!email) {
            return res.status(401).json({ status: "failed", message: "Unauthorized - No email found in token" });
        }

        const adminrole = await User.findOne({ email, role: "admin" });
        if (!adminrole) {
            return res.status(403).json({ status: "failed", message: "Access denied - Admin only" });
        }

        const dashboardData = await admin.getAdminStats(adminrole._id);

        if (!dashboardData || dashboardData.status === "failed") {
            return res.status(404).json({ status: "failed", message: "No admin dashboard data found" });
        }

        console.log("Admin dashboard data retrieved successfully");
        return res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};



module.exports = { createtask, viewTasks,getAdminDashboard, getNoticesWithTeams, createTeam, getTeamDetails, deleteTeam, createnotice, deleteNotice, deleteTask, updateTask, addUserToTeam, removeUserFromTeam };
