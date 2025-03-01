require('dotenv').config();
const userservice = require('../services/user.services');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const OTPModel = require("../model/otpModel")

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, date_of_birth, gender, password, phone_number, otp } = req.body;

        if (!first_name || !last_name || !email || !date_of_birth || !gender || !password || !phone_number || !otp) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        const existingUser = await userservice.loginDetails(email);
        if (existingUser.status === "success") {
            return res.status(400).json({ status: "failed", message: "Email is already registered" });
        }

        const matchedOtp = await OTPModel.findOne({ email, otp: otp.toString().trim() });


        if (!matchedOtp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        const currentTime = new Date();
        if (matchedOtp.expiresAt < currentTime) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        const userUpdateStatus = await userservice.createUser(req.body);
        if (userUpdateStatus.status === "failed") {
            return res.status(500).json(userUpdateStatus);
        }

        console.log("User registered successfully");
        return res.status(201).json(userUpdateStatus);

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};

const generateOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        console.log(OTP)

        await OTPModel.findOneAndUpdate(
            { email },
            { otp: OTP, expiresAt: otpExpiry },
            { upsert: true, new: true }
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "TeamSync: Your One-Time Password (OTP)",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <img src="https://team-sync-09eeee.vercel.app/assets/teamsyncLogo-DKjNVLKK.png" alt="TeamSync Logo" width="150" style="display: block; margin-bottom: 20px;">
                    <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
                    <p>Dear User,</p>
                    <p>Your OTP for TeamSync is: <strong style="font-size: 18px; color: #007BFF;">${OTP}</strong></p>
                    <p>This OTP is valid for the next <strong>5 minutes</strong>. Please do not share it with anyone for security reasons.</p>
                    <p>If you did not request this OTP, please ignore this email.</p>
                    <br>
                    <p style="font-size: 14px; color: #666;">Best regards,</p>
                    <p style="font-size: 14px; color: #666;">TeamSync Support</p>
                </div>
            `,
        };



        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email sending error:", error);
                return res.status(500).json({ message: "Error sending OTP" });
            }
            res.json({ message: "OTP sent successfully" });
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const login = async (req, res) => {
    const { email, password, otp } = req.body;
    console.log(req.body)
    if (!email || !password || !otp) {
        return res.status(400).json({
            status: "Failed",
            message: "All fields are required"
        });
    }

    try {
        const loginStatus = await userservice.loginDetails(email);
        if (loginStatus.status === "failed") {
            return res.status(404).json({ status: "failed", message: "Email not registered" });
        }

        const matchedOtp = await OTPModel.findOne({ email: email, otp: otp });
        if (!matchedOtp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        const currentTime = new Date();
        if (matchedOtp.expiresAt < currentTime) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (loginStatus.user.password === password) {
            console.log("Generating token...");
            const token = jwt.sign(
                {
                   userId: loginStatus.user._id,
                    email: loginStatus.user.email,
                    role: loginStatus.user.role,
                },
                process.env.SECRET_KEY_FOR_JWT,
                { expiresIn: '1h' }
            );
            console.log(token);
            console.log("Setting token cookie...");


            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            });

            console.log("Token cookie set successfully");

            return res.status(200).json({
                message: "Login successful",
                status: "success",
                token
            });

        } else {
            return res.status(400).json({ message: "Incorrect password" });
        }

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    registerUser,
    generateOtp,
    login
};
