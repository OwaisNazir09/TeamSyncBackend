const Task = require("../model/tasks");
const User = require("../model/user");
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

module.exports = { createtask, createNotice, deleteNotice,deleteTask, updateTask };