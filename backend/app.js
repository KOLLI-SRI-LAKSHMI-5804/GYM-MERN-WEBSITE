import express from "express";
import { config } from "dotenv";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";

// Load environment variables from .env file
config({ path: "./.env" });

const app = express();

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // Make sure this matches the frontend URL
    methods: ["POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Nodemailer email sending function
const sendEmail = async ({ name, email, message }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465",  // SSL for 465
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: "kollisrilakshmi19@gmail.com",  // Your recipient email
    subject: "GYM WEBSITE CONTACT",
    text: `Message: ${message}\n\nUser Email: ${email}`,
  };

  await transporter.sendMail(mailOptions);
};

// Route to handle email sending
app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Please provide all details." });
  }

  try {
    await sendEmail({ name, email, message });
    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
