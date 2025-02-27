const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("Cookies:", req.cookies); // Debugging
    console.log("Headers:", req.headers.authorization); // Debugging

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.SECRET_KEY_FOR_JWT, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: "failed", message: "Invalid or expired token" });
        }
        if (!decoded.email) {
            return res.status(400).json({ status: "failed", message: "Token does not contain email" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
