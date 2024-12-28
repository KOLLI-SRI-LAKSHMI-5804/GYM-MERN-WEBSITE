import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

// Initialize Express app
const app = express();

// Load environment variables from .env
config({ path: "./config.env" });

// Middleware to parse request body and handle CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Frontend URL for CORS
    methods: ["POST"],
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Route to handle sending emails
app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate that all required fields are present
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all details (name, email, message).",
    });
  }

  try {
    // Send email using the sendEmail function
    await sendEmail({
      email: "kollisrilakshmi19@gmail.com", // Receiver email
      subject: "GYM WEBSITE CONTACT",
      message,
      userEmail: email, // Sender email
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    // Log the error and send error response
    console.error("Error sending email:", error.message);
    res.status(500).json({
      success: false,
      message: `Failed to send email: ${error.message}`,
    });
  }
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
