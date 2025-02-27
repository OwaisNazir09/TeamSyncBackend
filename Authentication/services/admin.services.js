const Task = require("../model/tasks");
const User = require("../model/user");

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



module.exports = {createtask };