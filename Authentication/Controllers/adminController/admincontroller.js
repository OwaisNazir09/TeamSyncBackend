const User = require("../../model/user");
const admin = require("../../services/admin.services");
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
module.exports = { createtask };
