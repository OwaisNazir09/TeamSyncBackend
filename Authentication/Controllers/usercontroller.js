const userservice = require('../services/user.services');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, phone_no } = req.body;
        
        const data = { username, email, password, phone_no };

        const userUpdateStatus = await userservice.createuser(data);

        if (userUpdateStatus.status === "failed") {
            return res.status(500).json(userUpdateStatus);
        }

        return res.status(201).json(userUpdateStatus); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};

module.exports = {
    registerUser,
};
