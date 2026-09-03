require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
const sender = String(process.env.EMAIL_FROM || "onboarding@resend.dev").trim();

const sendOTP = async (email, otp) => {
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
            subject: "SIGLA TALA Email Verification",
            html: `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 10 minutes.</p>
        `
        }),
        signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
        throw new Error(`Resend API ${response.status}: ${await response.text()}`);
    }
};

module.exports = sendOTP;