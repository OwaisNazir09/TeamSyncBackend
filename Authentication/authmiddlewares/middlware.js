const validateUser = (req, res, next) => {
    const { username, email, password, phone_no } = req.body;

    if (!username || !email || !password || !phone_no) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: "failed", message: "Invalid email format" });
    }

    if (password.length < 6) {
        return res.status(400).json({ status: "failed", message: "Password must be at least 6 characters long" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_no)) {
        return res.status(400).json({ status: "failed", message: "Phone number must be 10 digits" });
    }

    next(); 
};

module.exports = validateUser;
