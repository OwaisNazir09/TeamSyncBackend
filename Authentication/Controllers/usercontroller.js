require('dotenv').config();
const userservice = require('../services/user.services');
const nodemailer = require("nodemailer");
 const OTPModel = require("../model/otpModel")


const registerUser = async (req, res) => {
    try {
        console.log(req.body);

        const { first_name, last_name, date_of_birth, gender, password, phone_number } = req.body;

        if (!first_name || !last_name || !date_of_birth || !gender || !password || !phone_number) {
            return res.status(400).json({
                status: "failed",
                message: "The following fields are required: first_name, last_name, date_of_birth, gender, password, phone_number"
            });
        }

        const userUpdateStatus = await userservice.createuser(req.body);

        if (userUpdateStatus.status === "failed") {
            return res.status(500).json(userUpdateStatus);
        }

        return res.status(201).json(userUpdateStatus);
    } catch (error) {

        return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};

const generateOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await OTPModel.findOneAndUpdate(
            { email },
            { otp: OTP, expiresAt: otpExpiry },
            { upsert: true, new: true }
        );

        const transporter = nodemailer.createTransport({
            host: "smtp.mail.yahoo.com",
            port: 465, 
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });
        

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP for teamsync is : ${OTP}. It expires in 5 minutes.`,
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


module.exports = {
    registerUser,
    generateOtp,
};
