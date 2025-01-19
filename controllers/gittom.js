const { gittomEmail } = require("../middleware/gittomEmail");
const db = require("../config/db");

// create email
exports.postGittomEmail = async (req, res) => {
  const { email, code } = req.body;

  // Check if all required fields are provided
  if (!email || !code) {
    return res.status(400).send({
      success: false,
      message: "Please provide email, code required fields",
    });
  }

  try {
    await db.query(`DELETE FROM gittiom WHERE email = ?`, [email]);

    // Insert file into the database
    const [result] = await db.query(
      "INSERT INTO gittiom (email, code) VALUES (?, ?)",
      [email, code]
    );

    if (result.insertId) {
      const emailData = {
        email: email,
        subject: "Verify your email for Gittiom Account",
        htmlContent: `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <img style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;" src="https://res.cloudinary.com/daizkkv04/image/upload/v1737280261/WhatsApp_Image_2025-01-19_at_11.03.52_s07aib.jpg" alt="companay logo">
            <h2 style="font-size: 28px; margin-top: 2px; font-family: Arial, sans-serif; color:rgb(0, 0, 0); margin: 0;">Gittiom</h2>
        </div>
        <div style="font-family: Arial, sans-serif; color: #555; line-height: 1.6; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; margin: 0 0 10px;">Hello,</p>
            <p style="font-size: 16px; margin: 0 0 20px;">Please use the code below to verify your email address:</p>
            <h1 style="font-size: 32px; color: #007BFF; text-align: center; background: #e7f3ff; padding: 10px 20px; border-radius: 8px; display: inline-block;">${code}</h1>
            <p style="font-size: 14px; margin: 20px 0 0;">If you didn’t request this, you can safely ignore this email.</p>
            <p style="font-size: 14px; margin: 10px 0 0;">Thank you,</p>
            <p style="font-size: 14px; font-weight: bold; margin: 5px 0 0;">The Gittiom Team</p>
        </div>
    `,
      };
      const emailResult = await gittomEmail(emailData);

      if (!emailResult.messageId) {
        res.status(500).send("Failed to send email");
      }
    }

    // Send success response
    res.status(200).send({
      success: true,
      message: "Email and code inserted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred while inserting the Email and code",
      error: error.message,
    });
  }
};

// check email and code
exports.checkEmailAndCode = async (req, res) => {
  const { email, code } = req.body;

  // Check if all required fields are provided
  if (!email || !code) {
    return res.status(400).send({
      success: false,
      message: "Please provide email, code required fields",
    });
  }

  try {
    const [result] = await db.query(
      "SELECT * FROM gittiom WHERE email=? AND code=?",
      [email, code]
    );

    if (result.length == 0) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Code",
      });
    }

    // Send success response
    res.status(200).send({
      success: true,
      message: "This Email and code match successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred while inserting the Email and Code",
      error: error.message,
    });
  }
};
