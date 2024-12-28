import nodeMailer from "nodemailer";

// Function to send email using Nodemailer
export const sendEmail = async (options) => {
  // Check if required environment variables are available
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

    // Create the transporter using the SMTP configuration
    const transporter = nodeMailer.createTransport({
      service: process.env.SMTP_SERVICE, // Gmail service
      host: process.env.SMTP_HOST, // Gmail SMTP host
      port: process.env.SMTP_PORT, // SMTP port (465 for SSL, 587 for TLS)
      secure: process.env.SMTP_PORT === "465", // Use SSL for port 465
      auth: {
        user: process.env.SMTP_MAIL, // Sender email
        pass: process.env.SMTP_PASSWORD, // App password or email password
      },
    });

    // Verify the transporter connection
    await transporter.verify();
    console.log("SMTP Transporter is ready.");

    // Set up email options
    const mailOptions = {
      from: process.env.SMTP_MAIL, // Sender email
      to: options.email, // Receiver email
      subject: options.subject, // Subject
      text: `Message: ${options.message}\n\nUser Email: ${options.userEmail}`, // Email body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    // Log and throw any errors during email sending
    console.error("Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
