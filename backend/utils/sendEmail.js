import nodemailer from "nodemailer";

// Function to send email using Nodemailer
export const sendEmail = async (options) => {
  // Check if all required environment variables are set
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_SERVICE ||
    !process.env.SMTP_MAIL ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("Missing SMTP configuration in environment variables.");
  }

  try {
    console.log("Creating transporter with SMTP configuration...");

    // Create the Nodemailer transporter with the provided SMTP settings
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE, // e.g., Gmail service
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT, // e.g., 465
      secure: process.env.SMTP_PORT === "465", // Use SSL for port 465
      auth: {
        user: process.env.SMTP_MAIL, // Sender email
        pass: process.env.SMTP_PASSWORD, // Sender app password
      },
    });

    // Verify the transporter
    await transporter.verify();
    console.log("SMTP Transporter is ready.");

    // Set up email options
    const mailOptions = {
      from: process.env.SMTP_MAIL, // Sender email
      to: options.email, // Receiver email (provided by the frontend)
      subject: options.subject, // Subject
      text: `Message: ${options.message}\n\nUser Email: ${options.userEmail}`, // Email body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    // Log and throw any errors
    console.error("Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
