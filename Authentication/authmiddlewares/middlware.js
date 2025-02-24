const validateUser = (req, res, next) => {
    const { first_name, last_name, email, password, phone_number, date_of_birth, gender } = req.body;

    // Check for missing fields
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

    next(); // Proceed to the next middleware
};

module.exports = validateUser;
