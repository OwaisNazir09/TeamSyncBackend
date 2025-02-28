const Task = require("../model/tasks");
const User = require("../model/user");
const notes = require("../model/personalnotes");

const dashboardstats = async (assignedTo) => {
    try {
        console.log(assignedTo)
        console.log("Fetching tasks for user ID:", assignedTo);

        const user = await User.findById(assignedTo);
        if (!user) {
            return { status: "failed", message: "User not found" };
        }

        const tasks = await Task.find({ assignedTo });

        const personalnotes = await notes.find({ createdby: assignedTo }).sort({ createdAt: -1 });

        return {
            status: "success",
            message: tasks.length ? "Tasks retrieved successfully" : "No tasks assigned",
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            },
            tasks, personalnotes
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};
const createnoteService = async ({ note, title, userId }) => {
    try {
        const creatednote = await notes.create({ text: note, title: title, createdby: userId });

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
       
        const deletedNote = await notes.findOneAndDelete({ _id:id });

      
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

module.exports = { dashboardstats, createnoteService, deletenoteService };
