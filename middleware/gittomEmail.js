const nodemailer = require("nodemailer");
require("dotenv").config();
const punycode = require("punycode/");

// Hostinger SMTP credentials
let transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADD,
    pass: process.env.EMAIL_PASS,
  },
});

async function gittomEmail(emailData) {
  try {
    const { email, subject, htmlContent } = emailData;

    const emailAddress = punycode.toASCII(email);

    const mailOptions = {
      from: process.env.EMAIL_ADD,
      to: emailAddress,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { gittomEmail };
