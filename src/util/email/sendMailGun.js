const nodemailer = require("nodemailer");
const nodemailerMailGun = require("nodemailer-mailgun-transport");

const sendMailGun = async ({ email, subject, message }) => {
  // 1) Create transporter (service that will send mail like ("Gmail" is best for development), ("Mailgun"  is best for production), "Mailtrap", and SendGrid)
  const auth = {
    auth: {
      api_key: process.env.MAIL_GUN_API_KEY,
      domain: process.env.MAIL_GUN_DOMAIN,
    },
  };
  const transporter = nodemailer.createTransport(nodemailerMailGun(auth));

  // 2) Define mail options like(From, To, Subject, Content)
  const mailOptions = {
    from: `E-shop <${process.env.MAIL_USER}>`,
    to: email, // should add in your account on mailgun site (in free plan for testing) on Overview Save Recipient
    subject: subject,
    text: message,
  };
  // 3) send tp mail
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    return false; // add from me
  }
  return true; // add from me
};

module.exports = sendMailGun;
