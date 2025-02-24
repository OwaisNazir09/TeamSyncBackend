const { generateOtp } = require('../Controllers/usercontroller');
const user = require('../model/user');

const createuser = async (data) => {
    try {
        const existingUser = await user.findOne({ phone_number: data.phone_number });
        if (existingUser) {
            return { status: "failed", message: "User already exists with this phone number" };
        }

        const usercreation = await user.create(data);

        if (!usercreation) {
            return { status: "failed", message: "User creation failed" };
        }

        return { status: "success", message: "User created successfully", user: usercreation };
    } catch (error) {
        console.error(error);
        return { status: "failed", message: "Error creating user", error: error.message };
    }
};

module.exports = {
    createuser,
    generateOtp,
};
