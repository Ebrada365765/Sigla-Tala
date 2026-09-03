const nodemailer = require("nodemailer");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: String(process.env.EMAIL_USER || "").trim(),
        pass: String(process.env.EMAIL_PASS || "").replace(/\s+/g, "")
    }
});

module.exports = (email, patientName, report) => transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Sigla Tala Medical Report",
    html: `
        <h2>Medical Report</h2>
        <p>Dear ${patientName},</p>
        <p>Your medical report is ready.</p>
        <p><strong>Doctor/Admin:</strong> ${report.doctor_name}</p>
        <p><strong>Date:</strong> ${report.recorded_date}</p>
        <p><strong>Diagnostic:</strong> ${report.diagnostic}</p>
        <p><strong>Medical Notes:</strong></p>
        <p>${report.notes.replace(/\n/g, "<br>")}</p>
    `
});
