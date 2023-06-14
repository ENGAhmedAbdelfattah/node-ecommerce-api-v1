const nodemailer = require("nodemailer");

const sendMailGmail = async ({
  email,
  subject,
  message,
}) => {
  // 1) Create transporter (service that will send mail like ("Gmail" is best for development), ("Mailgun"  is best for production), "Mailtrap", and SendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });
  // 2) Define mail options like(From, To, Subject, Content)
  const mailOptions = {
    from: `E-shop <${process.env.MAIL_USER}>`,
    to: email,
    subject: subject,
    text: message,
  };
  // 3) send tp mail
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    return false;
  }
  return true;
};

module.exports = sendMailGmail;
