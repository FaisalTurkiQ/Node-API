const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST_ZOHO,
      port: process.env.EMAIL_PORT_ZOHO,
      secure:true,
      auth: {
        user: process.env.EMAIL_USERNAME_ZOHO,
        pass: process.env.EMAIL_PASSWORD_ZOHO,
      },
    });

    // transporter.debug = process.env.NODE_ENV ==="DEV";

    const mailOptions = {
      from: `"InnoFrontIT CO." <${process.env.EMAIL_USERNAME_ZOHO}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
      // attachments: 
    };

    let info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

module.exports = sendEmail;
