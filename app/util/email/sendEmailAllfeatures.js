const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const sendEmail = async ({
  email,
  subject,
  // message,
  attachments,
  template,
  context,
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

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        partialsDir: "./app/views",
        defaultLayout: false,
      },
      viewPath: "./app/views",
      extName: ".handlebars",
    })
  );
  // 2) Define mail options like(From, To, Subject, Content)
  const mailOptions = {
    from: `E-shop <${process.env.MAIL_USER}>`,
    to: email,
    subject: subject,
    // text: message,
    attachments,
    template,
    context,
    // html
  };
  // 3) send tp mail
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    return false; // add from me
  }
  return true; // add from me
};

module.exports = sendEmail;

// to: email, can write more one email like "sadgas@gmail.com, asgee@yahoo.com, dgdglk@protonmail.com"

// send via parameter

// const attachments = [
//   {
//     filename:
//       "product-f940f30c-95c2-45b7-aa81-b4acbc86d480-1686020135766-cover.jpeg",
//     path: "./app/uploads/products/product-f940f30c-95c2-45b7-aa81-b4acbc86d480-1686020135766-cover.jpeg",
//   },
// ];
// const template = "email";
// const context = { name: user.name, code: resetCode };

// const mailOptions = {
//   from: `E-shop <${process.env.MAIL_USER}>`,
//   to: email,
//   cc: "",
//   bcc: "",
//   subject: subject,
//   text: message,
//   attachments: [{ filename: "", path: "" }], // path from root
//   template;
//   context
// };

//  , function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('تم ارسال البريد بنجاح: ' + info.response);
//   }
// });
