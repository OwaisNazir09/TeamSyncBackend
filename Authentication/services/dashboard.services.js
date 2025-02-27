const Task = require("../model/tasks");
const User = require("../model/user");
const notes = require("../model/personalnotes");

const dashboardstats = async (assignedTo) => {
    try {
        console.log("Fetching tasks for user ID:", assignedTo);

        const user = await User.findById(assignedTo);
        if (!user) {
            return { status: "failed", message: "User not found" };
        }

        const tasks = await Task.find({ assignedTo });

        console.log("Tasks assigned:", tasks);

        return {
            status: "success",
            message: tasks.length ? "Tasks retrieved successfully" : "No tasks assigned",
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            },
            tasks
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return { status: "failed", message: "Server error", error: error.message };
    }
};
const createnoteService = async ({ note, userId }) => {
    try {
        const creatednote = await notes.create({ text: note, createdby: userId });

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



module.exports = { dashboardstats, createnoteService };
