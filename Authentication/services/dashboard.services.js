const Task = require("../model/tasks");
const User = require("../model/user");
const Notes = require("../model/personalnotes");
const Team = require("../model/team")
const Notice = require("../model/notices")
const Attendance = require("../model/attendance")

const dashboardstats = async (userId) => {
    try {
        console.log("Fetching dashboard data for user ID:", userId);

        const user = await User.findById(userId).select("first_name last_name email");
        if (!user) {
            return { status: "failed", message: "User not found" };
        }

        const tasks = await Task.find({ assignedTo: userId });

        const personalnotes = await Notes.find({ createdby: userId })
            .sort({ createdAt: -1 });

        const team = await Team.findOne({
            $or: [{ members: userId }, { createdBy: userId }]
        }).populate("createdBy", "first_name last_name email");

        const notices = team
            ? await Notice.find({ team: team._id })
                .populate("createdBy", "first_name last_name email")
                .sort({ createdAt: -1 })
            : [];

        return {
            status: "success",
            message: "Dashboard data retrieved successfully",
            user,
            tasks,
            personalnotes,
            team,
            notices
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};


const createnoteService = async ({ note, title, userId }) => {
    try {
        const creatednote = await Notes.create({ text: note, title: title, createdby: userId });

        if (!creatednote) {
            return {
                status: "failed",
                message: "Unable to store note",
            };
        }
        return {
            status: "success",
            message: "Note saved successfully",
            creatednote,
        };
    } catch (error) {
        console.error("Error creating note:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};
const deletenoteService = async (id) => {
    try {

        const deletedNote = await Notes.findOneAndDelete({ _id: id });


        if (!deletedNote) {
            return {
                status: "failed",
                message: "Note not found or already deleted",
            };
        }

        return {
            status: "success",
            message: "Note deleted successfully",
            data: deletedNote,
        };
    } catch (error) {
        console.error("Error in deletenoteService:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};
const updatetask = async (id, status) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskstatus: status },
            { new: true }
        );

        if (!updatedTask) {
            return {
                status: "failed",
                message: "Task not found or already deleted",
            };
        }

        return {
            status: "success",
            message: "Task updated successfully",
            data: updatedTask,
        };
    } catch (error) {
        console.error("Error in updatetask:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};
const startAttendance = async (userId) => {
    try {
        const newAttendance = new Attendance({ userId, startTime: new Date() });
        await newAttendance.save();

        return {
            status: "success",
            message: "Attendance started successfully",
            data: newAttendance
        };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

const startBreak = async (userId) => {
    try {
        const attendance = await Attendance.findOne({ userId, endTime: null });
        if (!attendance) return { status: "failed", message: "No active session found" };

        attendance.breakTimes.push({ start: new Date() });
        await attendance.save();

        return { status: "success", message: "Break started", data: attendance };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

const endBreak = async (userId) => {
    try {
        const attendance = await Attendance.findOne({ userId, endTime: null });
        if (!attendance || attendance.breakTimes.length === 0)
            return { status: "failed", message: "No active break found" };

        const lastBreak = attendance.breakTimes[attendance.breakTimes.length - 1];
        if (!lastBreak.end) lastBreak.end = new Date();

        await attendance.save();
        return { status: "success", message: "Break ended", data: attendance };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};

const endAttendance = async (userId) => {
    try {
        const attendance = await Attendance.findOne({ userId, endTime: null });
        if (!attendance) return { status: "failed", message: "No active session found" };

        attendance.endTime = new Date();

        const totalMilliseconds =
            attendance.endTime - attendance.startTime -
            attendance.breakTimes.reduce((acc, breakTime) => acc + (breakTime.end - breakTime.start || 0), 0);

        attendance.totalHours = totalMilliseconds / (1000 * 60 * 60); // Convert to hours
        await attendance.save();

        return { status: "success", message: "Attendance ended", data: attendance };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};


module.exports = { dashboardstats, updatetask, createnoteService, deletenoteService, startAttendance, startBreak, endBreak, endAttendance };
