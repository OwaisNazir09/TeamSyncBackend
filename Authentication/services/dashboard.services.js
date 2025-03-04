const Task = require("../model/tasks");
const User = require("../model/user");
const Notes = require("../model/personalnotes");
const Team = require("../model/team")
const Notice = require("../model/notices")
const userContact = require("../model/Contact")
const Attendance = require("../model/attendance")
const userEmployment = require("../model/Employment")

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

        const workLog = await Attendance.findOne({ userId }).sort({ date: -1 });


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
            notices,
            workLog
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
        const newAttendance = new Attendance({ userId, isPresent: "yes", startTime: new Date() });
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
        attendance.isPresent = "no";

        const totalMilliseconds =
            attendance.endTime - attendance.startTime -
            attendance.breakTimes.reduce((acc, breakTime) => acc + (breakTime.end - breakTime.start || 0), 0);

        attendance.totalHours = totalMilliseconds / (1000 * 60 * 60);
        await attendance.save();

        return { status: "success", message: "Attendance ended", data: attendance };
    } catch (error) {
        return { status: "failed", message: error.message };
    }
};



const getProfileStats = async ({ email }) => {
    try {
        const user = await User.findOne({ email }).select("-password");
        if (!user) {
            return { status: "failed", message: "User not found" };
        }

        console.log(user)
        const userId = user._id;
        console.log(userId)

        const employmentDetails = await userEmployment.findOne({ userId });
        const contactDetails = await userContact.findOne({ userId });
        return {
            status: "success",
            message: "Profile stats retrieved successfully",
            data: {
                user,
                employment: employmentDetails || {},
                contact: contactDetails || {},
            },
        };
    } catch (error) {
        console.error("Error fetching profile stats:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};
const updateUserProfile = async ({ email, data }) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            data,
            { new: true }
        );

        if (!updatedUser) {
            return { status: "failed", message: "User not found" };
        }

        return { status: "success", message: "Profile updated", data: updatedUser };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

const updateEmploymentDetails = async ({ email, data }) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: "failed", message: "User not found" };

        const updatedEmployment = await userEmployment.findOneAndUpdate(
            { userId: user._id },
            data,
            { new: true, upsert: true }
        );

        return { status: "success", message: "Employment details updated", data: updatedEmployment };
    } catch (error) {
        console.error("Error updating employment details:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};

const updateContactDetails = async ({ email, data }) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: "failed", message: "User not found" };

        const updatedContact = await userContact.findOneAndUpdate(
            { userId: user._id },
            data,
            { new: true, upsert: true }
        );

        return { status: "success", message: "Contact details updated", data: updatedContact };
    } catch (error) {
        console.error("Error updating contact details:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};



module.exports = {
    dashboardstats, updateUserProfile,
    updateEmploymentDetails,
    updateContactDetails, getProfileStats, updatetask, createnoteService, deletenoteService, startAttendance, startBreak, endBreak, endAttendance
};
