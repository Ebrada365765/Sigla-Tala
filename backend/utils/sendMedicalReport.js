require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
const sender = String(process.env.EMAIL_FROM || "onboarding@resend.dev").trim();

module.exports = async (email, patientName, report) => {
    if (!resendApiKey) {
        throw new Error("RESEND_API_KEY is not configured.");
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: sender,
            to: [email],
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
        }),
        signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Resend API ${response.status}: ${details}`);
    }
};
