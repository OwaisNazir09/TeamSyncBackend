const User = require('../model/user');
const createUser = async (data) => {
    try {
        console.log("Received data for user creation:", data);

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return { status: "failed", message: "User already exists with this email" };
        }

        const newUser = await User.create(data);
        console.log("User created successfully:", newUser);

        return { status: "success", message: "User created successfully", user: newUser };
    } catch (error) {
        console.error("Error creating user:", error);
        return { status: "failed", message: "Error creating user", error: error.message };
    }
};

const loginDetails = async (email) => {
    try {
        console.log("Checking user with email:", email);

        const user = await User.findOne({ email });
        if (!user) {
            return { status: "failed", message: "User not found" };
        }

        return { status: "success", message: "User found successfully", user };
    } catch (error) {
        return { status: "failed", message: "Error finding user", error: error.message };
    }
};

module.exports = {
    createUser,
    loginDetails
};
