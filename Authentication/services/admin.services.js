const Task = require("../model/tasks");
const User = require("../model/user");
const Team = require("../model/team");
const Notices = require("../model/notices");
const Attendance = require('../model/attendance')

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




const getTeamTasks = async (adminId) => {

    const team = await Team.findOne({ createdBy: adminId });
    if (!team) throw new Error("Team not found");

    const memberIds = team.members.map((member) => member.toString());

    const users = await User.find({ _id: { $in: memberIds } }).select("-password");

    const tasks = await Task.find({ assignedTo: { $in: memberIds } });

    const teamMembers = users.map((user) => {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            tasks: tasks.filter((task) => task.assignedTo.toString() === user._id.toString())
        };
    });

    return { teamMembers };
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

const getNoticesWithTeams = async (userId) => {
    const teams = await Team.find({ createdBy: userId });
    const teamIds = teams.map(team => team._id);

    const notices = await Notices.find({ team: { $in: teamIds } })
        .populate("team", "name")
        .select("title description team createdAt");

    return notices;
};
const getAdminStats = async (adminId) => {
    try {
        console.log("Fetching latest team data for admin ID:", adminId);

        // Get the latest team created by the admin
        const latestTeam = await Team.findOne({ createdBy: adminId })
            .sort({ createdAt: -1 }) // Sorting in descending order to get the latest
            .populate("members", "_id email first_name last_name joiningDate");

        if (!latestTeam) {
            return { status: "failed", message: "No teams found for this admin" };
        }

        // Extract unique members from the latest team
        const uniqueMemberIds = new Set();
        const teamMembers = [];

        latestTeam.members.forEach(member => {
            if (!uniqueMemberIds.has(member._id.toString())) {
                uniqueMemberIds.add(member._id.toString());
                teamMembers.push(member);
            }
        });

        const teamMemberIds = Array.from(uniqueMemberIds);

        // Fetch tasks assigned to team members
        const tasks = await Task.find({ assignedTo: { $in: teamMemberIds } });

        // Normalize taskstatus values to lowercase
        const normalizedTasks = tasks.map(task => ({
            ...task.toObject(),
            taskstatus: task.taskstatus.toLowerCase(),
        }));

        // Fetch notices related to this latest team
        const notices = await Notices.find({ team: latestTeam._id }).populate("createdBy", "first_name last_name email");

        // Fetch attendance records for the team members
        const attendanceRecords = await Attendance.find({ userId: { $in: teamMemberIds } }).sort({ date: -1 });

        // Structure attendance by user
        const attendanceByUser = {};
        teamMembers.forEach(member => {
            attendanceByUser[member._id] = attendanceRecords.filter(att => att.userId.toString() === member._id.toString());
        });

        // Count tasks by status
        const totalTasks = normalizedTasks.length;
        const completedTasks = normalizedTasks.filter(task => task.taskstatus === "completed").length;
        const pendingTasks = normalizedTasks.filter(task => task.taskstatus === "pending").length;
        const inProgressTasks = normalizedTasks.filter(task => task.taskstatus === "in progress").length;

        return {
            status: "success",
            message: "Latest team data retrieved successfully",
            latestTeamId: latestTeam._id,
            latestTeamName: latestTeam.name,
            totalTeamMembers: teamMembers.length, // Now correctly counts unique members
            teamMembers: teamMembers.map(member => ({
                _id: member._id,
                email: member.email,
                name: `${member.first_name} ${member.last_name}`,
                joiningDate: member.joiningDate,
                attendance: attendanceByUser[member._id] || [],
            })),
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            tasks: normalizedTasks,
            notices,
            attendance: attendanceRecords,
        };
    } catch (error) {
        console.error("Error fetching latest team data:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

module.exports = { getAdminStats, createtask, getTeamTasks, getNoticesWithTeams, getTeamDetails, findTeamByAdmin, removeUserFromTeam, deleteTeam, addUserToTeam, createTeam, createNotice, deleteNotice, deleteTask, updateTask };