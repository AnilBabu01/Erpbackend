const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.ADMINEMAIL,
      pass: process.env.ADMINEMAILPASSWORD,
    },
  });

  const message = {
    from: process.env.ADMINEMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
