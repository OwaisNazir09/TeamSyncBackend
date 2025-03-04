const Task = require("../model/tasks");
const User = require("../model/user");
const Team = require("../model/team");
const Notices = require("../model/notices");

const createtask = async ({ email, title, assignedTo, taskstatus, dueDate }) => {
    try {
        const newTask = await Task.create({
            title,
            assignedTo,
            status: taskstatus,
            dueDate
        });

        return {
            status: "success",
            message: "Task created successfully",
            task: newTask
        };

    } catch (error) {
        console.error("Error creating task:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

const createNotice = async ({ title, description, createdBy, team }) => {
    try {
        const newNotice = await Notices.create({
            title,
            description,
            createdBy,
            team,
        });

        return {
            status: "success",
            message: "Notice created successfully",
            notice: newNotice,
        };

    } catch (error) {
        console.error("Error creating notice:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

const deleteNotice = async (noticeId) => {
    try {
        const deletedNotice = await Notices.findByIdAndDelete(noticeId);

        if (!deletedNotice) {
            return { status: "failed", message: "Notice not found" };
        }

        return { status: "success", message: "Notice deleted successfully" };

    } catch (error) {
        console.error("Error deleting notice:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

const deleteTask = async (taskId) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return { status: "failed", message: "Task not found" };
        }

        return { status: "success", message: "Task deleted successfully" };

    } catch (error) {
        console.error("Error deleting task:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

const updateTask = async (taskId, updates) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

        if (!updatedTask) {
            return { status: "failed", message: "Task not found" };
        }

        return { status: "success", message: "Task updated successfully", task: updatedTask };

    } catch (error) {
        console.error("Error updating task:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};


const createTeam = async ({ name, description, members, createdBy }) => {
    try {
        const updateteamCreated = await User.findOneAndUpdate(
            { _id: createdBy },
            { $set: { teamCreted: "yes" } },
            { new: true }
        );

        const userRecords = await User.find({ email: { $in: members } }).select("_id");

        const memberIds = userRecords.map(user => user._id);

        if (memberIds.length !== members.length) {
            return { status: "failed", message: "Some emails do not match any users" };
        }

        const newTeam = await Team.create({
            name,
            description,
            members: memberIds,
            createdBy,

        });
        return {
            status: "success",
            message: "Team created successfully",
            team: newTeam,
            updateteamCreated
        };
    } catch (error) {
        console.error("Error creating team:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};



const deleteTeam = async (teamId) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(teamId);
        return deletedTeam;
    } catch (error) {
        console.error("Error in deleteTeam service:", error);
        throw error;
    }
};
const addUserToTeam = async (teamId, userIds) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $addToSet: { members: { $each: userIds } } }, // Prevents duplicates
            { new: true }
        );

        return updatedTeam;
    } catch (error) {
        console.error("Error in addUserToTeam service:", error);
        throw error;
    }
};
const removeUserFromTeam = async (teamId, userIds) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $pull: { members: { $in: userIds } } },
            { new: true }
        );

        return updatedTeam;
    } catch (error) {
        console.error("Error in removeUserFromTeam service:", error);
        throw error;
    }
};

const getTeamDetails = async (userId) => {
    try {
        return await Team.findOne({ createdBy: userId }).populate("members", "email name");
    } catch (error) {
        console.error("Error in service layer:", error);
        throw error;
    }
};

const findTeamByAdmin = async (adminId) => {
    try {
        return await Team.findOne({ createdBy: adminId }).populate("_id");
    } catch (error) {
        console.error("Error in service layer:", error);
        throw error;
    }
}


module.exports = { createtask, getTeamDetails, findTeamByAdmin, removeUserFromTeam, deleteTeam, addUserToTeam, createTeam, createNotice, deleteNotice, deleteTask, updateTask };