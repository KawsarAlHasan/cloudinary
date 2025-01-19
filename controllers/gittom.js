const { gittomEmail } = require("../middleware/gittomEmail");

// create Orders
exports.postGittomEmail = async (req, res) => {
  const { email, url } = req.body;

  // Check if all required fields are provided
  if (!email || !url) {
    return res.status(400).send({
      success: false,
      message: "Please provide email, url required fields",
    });
  }

  try {
    const emailData = {
      email: email,
      subject: "Verify your email for Gittiom Account",
      htmlContent: `
            <p>Hello,</p>
            <p>Follow this link to verify your email address:</p>
            <a href=${url}>${url}</a>
            <p>If you didn't ask to verify this address, you can ignore this email.</p>
            <p>Thanks,</p>
            <p>Your Gittiom team</p>
        `,
    };
    const emailResult = await gittomEmail(emailData);

    if (!emailResult.messageId) {
      res.status(500).send("Failed to send email");
    }

    // Send success response
    res.status(200).send({
      success: true,
      message: "Order inserted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred while inserting the order",
      error: error.message,
    });
  }
};
