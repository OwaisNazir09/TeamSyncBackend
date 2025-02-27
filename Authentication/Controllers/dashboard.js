const User = require("../model/user");
const dashboardService = require("../services/dashboard.services");

const usedashboard = async (req, res) => {
    try {
        const email = req.user?.email;
        console.log("Received dashboard request for email:", email);

        if (!email) {
            return res.status(401).json({ status: "failed", message: "Unauthorized - No email found in token" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        const taskDetails = await dashboardService.dashboardstats(user._id);
        if (!taskDetails || taskDetails.status === "failed") {
            return res.status(404).json({ status: "failed", message: "No dashboard stats found" });
        }


        const tasks = taskDetails.tasks;

        const statusCounts = tasks.reduce((acc, task) => {
            const status = task.taskstatus.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const performanceData = [
            { name: "Completed", value: statusCounts.completed || 0, color: "#4CAF50" },
            { name: "In Progress", value: statusCounts["in progress"] || 0, color: "#2196F3" },
            { name: "Pending", value: statusCounts.pending || 0, color: "#FFC107" },
        ];







        console.log("Dashboard data retrieved successfully");
        return res.status(200).json({ taskDetails, performanceData });


    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};
const createnote = async (req, res) => {
    const email = req.cookies.email;
    const note = req.body.note;
    if (!email) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - No email found in token" });
    }

    const user = await User.findOne({ email }); 
    if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
    }

    const creatednote = await dashboardService.createnoteService({ note, userId: user._id }); 

    if (!creatednote || creatednote.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error creating note" });
    }

    return res.status(200).json({ creatednote });
};

module.exports = { usedashboard, createnote };
