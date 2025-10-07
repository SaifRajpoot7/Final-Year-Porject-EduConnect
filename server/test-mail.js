import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("DEBUG ENV:", {
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS ? "SET" : "NOT SET",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: "your_other_email@gmail.com",
    subject: "Test Email ✔",
    text: "This is a test email using Gmail App Password!",
  });

  console.log("✅ Email sent:", info.response);
} catch (err) {
  console.error("❌ Send failed:", err);
}



import mailSender from "./src/utils/mailSender"

function sendd() {
    const testSend = async () => {
        await mailSender({
            email: "saiflaptop1@gmail.com",
            subject: "Welcome to EduConnect 🎓",
            name: "Saif",
            url: "http://localhost:3000/verify",
            body: ({ name, url }) => `
      <h1>Hello ${name},</h1>
      <p>Welcome to EduConnect!</p>
      <p>Click below to verify your account:</p>
      <a href="${url}">Verify Now</a>
    `,
        });
    };

    testSend();

}
export default sendd;