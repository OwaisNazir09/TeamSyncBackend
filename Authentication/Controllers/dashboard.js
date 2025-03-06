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

        const dashboardstats = await dashboardService.dashboardstats(user._id);

        if (!dashboardstats || dashboardstats.status === "failed") {
            return res.status(404).json({ status: "failed", message: "No dashboard stats found" });
        }


        const tasks = dashboardstats.tasks;

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
        return res.status(200).json({ dashboardstats, performanceData });


    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};

const createnote = async (req, res) => {
    const email = req.user.email;
    const { title } = req.body;
    const note = req.body.text;

    if (!email) {
        return res.status(401).json({ status: "failed", message: "token doest conatin email" });
    }

    console.log(title)
    console.log(title)
    if (!title || !note) {

        return res.status(400).json({ status: "failed", message: "AlL fiels req" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
    }

    const creatednote = await dashboardService.createnoteService({ note, title, userId: user._id });

    if (!creatednote || creatednote.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error creating note" });
    }

    return res.status(200).json({ creatednote });
};

const deletenote = async (req, res) => {

    const { id } = req.query;
    if (!id) {

        return res.status(400).json({ status: "failed", message: "qury required" });
    }

    const deletenote = await dashboardService.deletenoteService(id);

    if (!deletenote || deletenote.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error deleating  note" });
    }

    return res.status(200).json({ deletenote });
};


const logout = async (req, res) => {
    const email = req.user.email;
    if (!email) {
        return res.status(401).json({ status: "failed", message: "Token does not contain email" });
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });

    return res.status(200).json({ status: "success", message: "Logged out successfully" });
};
const updatetask = async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ status: "failed", message: "AL fields required " });
    }

    const updatetaskdetail = await dashboardService.updatetask(id, status);

    if (!updatetaskdetail || updatetaskdetail.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error upadting task  " });
    }

    return res.status(200).json({ status: "success", message: "task upadted successfully successfully", updatetaskdetail });

}

const startAttendance = async (req, res) => {
    const { userId } = req.user;

    const result = await dashboardService.startAttendance(userId);
    if (!result || result.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error starting attendance" });
    }

    return res.status(200).json({ status: "success", message: "Attendance started successfully", data: result });
};

const startBreak = async (req, res) => {
    const { userId } = req.user;

    const result = await dashboardService.startBreak(userId);
    if (!result || result.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error starting break" });
    }

    return res.status(200).json({ status: "success", message: "Break started successfully", data: result });
};

const endBreak = async (req, res) => {
    const { userId } = req.user;

    const result = await dashboardService.endBreak(userId);
    if (!result || result.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error ending break" });
    }

    return res.status(200).json({ status: "success", message: "Break ended successfully", data: result });
};

const endAttendance = async (req, res) => {
    const { userId } = req.user;

    const result = await dashboardService.endAttendance(userId);
    if (!result || result.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error ending attendance" });
    }

    return res.status(200).json({ status: "success", message: "Attendance ended successfully", data: result });
};


const profilestats = async (req, res) => {
    const email = req.user.email;
    if (!email) {
        return res.status(401).json({ status: "failed", message: "Token does not contain email" });
    }

    const userStats = await dashboardService.getProfileStats({ email });

    if (!userStats || userStats.status === "failed") {
        return res.status(500).json({ status: "failed", message: "Error fetching profile stats" });
    }

    return res.status(200).json({ userStats });
};
const updateUser = async (req, res) => {
    try {
        const email = req.user.email;
        const updatedUser = await dashboardService.updateUserProfile({ email, data: req.body });

        if (updatedUser.status === "failed") {
            return res.status(400).json(updatedUser);
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};

// Update employment details
const updateEmployment = async (req, res) => {
    try {
        const email = req.user.email;
        const result = await dashboardService.updateEmploymentDetails({ email, data: req.body });

        if (result.status === "failed") {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating employment details:", error);
        res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const email = req.user.email;
        const result = await dashboardService.updateContactDetails({ email, data: req.body });

        if (result.status === "failed") {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating contact details:", error);
        res.status(500).json({ status: "failed", message: "Server error", error: error.message });
    }
};




module.exports = {
    usedashboard, updateUser,
    updateEmployment,
    updateContact, updatetask, logout, profilestats, deletenote, createnote, startAttendance, startBreak, endBreak, endAttendance,
};
