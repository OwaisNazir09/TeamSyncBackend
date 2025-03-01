require('dotenv').config();
const crypto = require('crypto');
const SALT = process.env.SALT;


const validateUser = (req, res, next) => {
    const { first_name, last_name, email, password, phone_number, date_of_birth, gender } = req.body;

    const missingFields = [];
    if (!first_name) missingFields.push("first_name");
    if (!last_name) missingFields.push("last_name");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!phone_number) missingFields.push("phone_number");
    if (!date_of_birth) missingFields.push("date_of_birth");
    if (!gender) missingFields.push("gender");

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: "failed",
            message: `The following fields are required: ${missingFields.join(", ")}`,
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: "failed",
            message: "Invalid email format. Please provide a valid email address.",
        });
    }

    // Password validation
    if (password.length < 6) {
        return res.status(400).json({
            status: "failed",
            message: "Password must be at least 6 characters long.",
        });
    }

    // Phone number validation (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({
            status: "failed",
            message: "Phone number must be exactly 10 digits.",
        });
    }

    next(); 
};

const hashPassword = (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                status: "failed",
                reason: "Provide a password"
            });
        }

        const hashedPassword = crypto.pbkdf2Sync(password, SALT, 100000, 64, 'sha256').toString('hex');

        req.body.password = hashedPassword;

        next();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ status: "failed", message: "Access denied. Admins only" });
    }
};



module.exports = { validateUser, hashPassword ,isAdmin}
