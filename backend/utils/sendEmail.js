const nodemailer = require("nodemailer");

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const emailUser = String(process.env.EMAIL_USER || "").trim();
const emailPass = String(process.env.EMAIL_PASS || "").replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
    service: "gmail",
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

const sendOTP = async (email, otp) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "SIGLA TALA Email Verification",
        html: `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 10 minutes.</p>
        `
    });

};

module.exports = sendOTP;