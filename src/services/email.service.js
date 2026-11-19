import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "🎉 Welcome to Backend Ledger!";

  const text = `
Hello ${name},

Welcome to Backend Ledger!

Thank you for registering with us. We're excited to have you on board.

Get ready to explore our platform and enjoy your experience with us.

Best Regards,
The Backend Ledger Team
  `;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Backend Ledger</title>
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f9;
    font-family: Arial, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0"
      style="padding: 40px 15px; background-color: #f4f6f9;">

      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="
              max-width: 600px;
              width: 100%;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            ">

            <!-- Header -->
            <tr>
              <td align="center"
                style="
                  background: linear-gradient(135deg, #4f46e5, #7c3aed);
                  padding: 35px 20px;
                  color: #ffffff;
                ">

                <h1 style="margin: 0; font-size: 28px;">
                  Backend Ledger
                </h1>

                <p style="margin: 10px 0 0; font-size: 15px;">
                  Welcome to Our Community!
                </p>

              </td>
            </tr>

            <!-- Email Content -->
            <tr>
              <td style="padding: 40px 35px; color: #333333;">

                <h2 style="color: #4f46e5; font-size: 23px;">
                  Hello ${name} 👋
                </h2>

                <p style="font-size: 16px; line-height: 1.7;">
                  Congratulations! 🎉
                  Your registration was successful.
                </p>

                <p style="font-size: 15px; line-height: 1.8; color: #555;">
                  Thank you for joining <b>Backend Ledger</b>.
                  We're excited to have you on board!
                </p>

                <p style="font-size: 15px; line-height: 1.8; color: #555;">
                  Get ready to explore our platform and experience
                  something amazing with us.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <span style="
                    display: inline-block;
                    background-color: #4f46e5;
                    color: #ffffff;
                    padding: 14px 30px;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: bold;
                  ">
                    Welcome Aboard!
                  </span>
                </div>

                <p style="font-size: 15px; line-height: 1.7;">
                  Best Regards,<br>
                  <b style="color: #4f46e5;">
                    The Backend Ledger Team
                  </b>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  background-color: #f8fafc;
                  padding: 20px;
                  border-top: 1px solid #eeeeee;
                ">

                <p style="font-size: 12px; color: #888; margin: 0;">
                  © ${new Date().getFullYear()} Backend Ledger.
                  All rights reserved.
                </p>

                <p style="font-size: 12px; color: #999; margin: 8px 0 0;">
                  Thank you for being part of our journey!
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "💸 Transaction Successful - Backend Ledger";

  const formattedAmount = Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const text = `
Hello ${name},

Your transaction has been successfully completed!

Transaction Details:
--------------------------------
Amount: ${formattedAmount}
Transferred To: ${toAccount}
Status: Successful
--------------------------------

Thank you for using Backend Ledger.

Best Regards,
The Backend Ledger Team
  `;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Successful</title>
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f9;
    font-family: Arial, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0"
      style="padding: 40px 15px; background-color: #f4f6f9;">

      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="
              max-width: 600px;
              width: 100%;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            ">

            <!-- Header -->
            <tr>
              <td align="center"
                style="
                  background: linear-gradient(135deg, #059669, #10b981);
                  padding: 35px 20px;
                  color: #ffffff;
                ">

                <h1 style="margin: 0; font-size: 27px;">
                  Backend Ledger
                </h1>

                <p style="margin: 10px 0 0; font-size: 15px;">
                  Transaction Notification
                </p>

              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 35px; color: #333333;">

                <div style="text-align: center;">

                  <div style="
                    width: 65px;
                    height: 65px;
                    line-height: 65px;
                    background-color: #d1fae5;
                    color: #059669;
                    border-radius: 50%;
                    font-size: 35px;
                    margin: 0 auto 15px;
                  ">
                    ✓
                  </div>

                  <h2 style="color: #059669; margin: 10px 0;">
                    Transaction Successful!
                  </h2>

                  <p style="color: #666; font-size: 15px;">
                    Hello ${name}, your transaction has been completed successfully.
                  </p>

                </div>

                <!-- Amount -->
                <div style="
                  background-color: #ecfdf5;
                  padding: 25px;
                  border-radius: 10px;
                  text-align: center;
                  margin: 25px 0;
                ">

                  <p style="margin: 0; color: #555; font-size: 14px;">
                    Total Amount Transferred
                  </p>

                  <h1 style="
                    margin: 12px 0 0;
                    color: #059669;
                    font-size: 32px;
                  ">
                    ${formattedAmount}
                  </h1>

                </div>

                <!-- Transaction Details -->
                <h3 style="color: #333; margin-bottom: 15px;">
                  Transaction Details
                </h3>

                <table width="100%" cellpadding="12" cellspacing="0"
                  style="
                    border: 1px solid #eeeeee;
                    border-radius: 8px;
                    font-size: 14px;
                  ">

                  <tr>
                    <td style="color: #777;">Account Holder</td>
                    <td align="right" style="font-weight: bold;">
                      ${name}
                    </td>
                  </tr>

                  <tr style="background-color: #f9fafb;">
                    <td style="color: #777;">Transferred To</td>
                    <td align="right" style="font-weight: bold;">
                      ${toAccount}
                    </td>
                  </tr>

                  <tr>
                    <td style="color: #777;">Transaction Status</td>
                    <td align="right">
                      <span style="
                        color: #059669;
                        font-weight: bold;
                      ">
                        ● Successful
                      </span>
                    </td>
                  </tr>

                </table>

                <p style="
                  margin-top: 25px;
                  font-size: 14px;
                  line-height: 1.7;
                  color: #666;
                ">
                  Thank you for choosing <b>Backend Ledger</b>.
                  We appreciate your trust in our platform.
                </p>

                <p style="font-size: 14px; line-height: 1.7;">
                  Best Regards,<br>
                  <b style="color: #059669;">
                    The Backend Ledger Team
                  </b>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  background-color: #f8fafc;
                  padding: 22px;
                  border-top: 1px solid #eeeeee;
                ">

                <p style="font-size: 12px; color: #888; margin: 0;">
                  © ${new Date().getFullYear()} Backend Ledger.
                  All rights reserved.
                </p>

                <p style="font-size: 12px; color: #999; margin: 8px 0 0;">
                  This is an automated transaction notification.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "❌ Transaction Failed - Backend Ledger";

  const formattedAmount = Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const text = `
Hello ${name},

Unfortunately, your transaction could not be completed.

Transaction Details:
--------------------------------
Amount: ${formattedAmount}
Transferred To: ${toAccount}
Status: Failed
--------------------------------

Please check your account details and try again.

If the amount has been deducted, please contact our support team.

Best Regards,
The Backend Ledger Team
  `;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Failed</title>
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f9;
    font-family: Arial, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0"
      style="padding: 40px 15px; background-color: #f4f6f9;">

      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="
              max-width: 600px;
              width: 100%;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            ">

            <!-- Header -->
            <tr>
              <td align="center"
                style="
                  background: linear-gradient(135deg, #dc2626, #ef4444);
                  padding: 35px 20px;
                  color: #ffffff;
                ">

                <h1 style="margin: 0; font-size: 27px;">
                  Backend Ledger
                </h1>

                <p style="margin: 10px 0 0; font-size: 15px;">
                  Transaction Notification
                </p>

              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 35px; color: #333333;">

                <div style="text-align: center;">

                  <div style="
                    width: 65px;
                    height: 65px;
                    line-height: 65px;
                    background-color: #fee2e2;
                    color: #dc2626;
                    border-radius: 50%;
                    font-size: 35px;
                    margin: 0 auto 15px;
                  ">
                    ✕
                  </div>

                  <h2 style="color: #dc2626; margin: 10px 0;">
                    Transaction Failed!
                  </h2>

                  <p style="color: #666; font-size: 15px; line-height: 1.7;">
                    Hello ${name}, unfortunately your transaction
                    could not be completed.
                  </p>

                </div>

                <!-- Amount -->
                <div style="
                  background-color: #fef2f2;
                  padding: 25px;
                  border-radius: 10px;
                  text-align: center;
                  margin: 25px 0;
                ">

                  <p style="margin: 0; color: #666; font-size: 14px;">
                    Transaction Amount
                  </p>

                  <h1 style="
                    margin: 12px 0 0;
                    color: #dc2626;
                    font-size: 32px;
                  ">
                    ${formattedAmount}
                  </h1>

                </div>

                <!-- Transaction Details -->
                <h3 style="color: #333; margin-bottom: 15px;">
                  Transaction Details
                </h3>

                <table width="100%" cellpadding="12" cellspacing="0"
                  style="
                    border: 1px solid #eeeeee;
                    border-radius: 8px;
                    font-size: 14px;
                  ">

                  <tr>
                    <td style="color: #777;">Account Holder</td>
                    <td align="right" style="font-weight: bold;">
                      ${name}
                    </td>
                  </tr>

                  <tr style="background-color: #f9fafb;">
                    <td style="color: #777;">Transferred To</td>
                    <td align="right" style="font-weight: bold;">
                      ${toAccount}
                    </td>
                  </tr>

                  <tr>
                    <td style="color: #777;">Transaction Status</td>
                    <td align="right">
                      <span style="color: #dc2626; font-weight: bold;">
                        ● Failed
                      </span>
                    </td>
                  </tr>

                </table>

                <!-- Warning Message -->
                <div style="
                  background-color: #fff7ed;
                  border-left: 4px solid #f97316;
                  padding: 15px;
                  margin-top: 25px;
                  border-radius: 5px;
                ">

                  <p style="
                    margin: 0;
                    color: #9a3412;
                    font-size: 14px;
                    line-height: 1.7;
                  ">
                    <b>Important Notice:</b><br>
                    If the amount has been deducted from your account,
                    please contact our support team for assistance.
                  </p>

                </div>

                <p style="
                  margin-top: 25px;
                  font-size: 14px;
                  line-height: 1.7;
                  color: #666;
                ">
                  Please verify your account details and try again.
                  We apologize for the inconvenience.
                </p>

                <p style="font-size: 14px; line-height: 1.7;">
                  Best Regards,<br>
                  <b style="color: #dc2626;">
                    The Backend Ledger Team
                  </b>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  background-color: #f8fafc;
                  padding: 22px;
                  border-top: 1px solid #eeeeee;
                ">

                <p style="font-size: 12px; color: #888; margin: 0;">
                  © ${new Date().getFullYear()} Backend Ledger.
                  All rights reserved.
                </p>

                <p style="font-size: 12px; color: #999; margin: 8px 0 0;">
                  This is an automated transaction notification.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

export default {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
