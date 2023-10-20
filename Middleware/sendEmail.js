const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "anilb9850@gmail.com",
      pass: "tqvjzifnjjkltqlk",
    },
  });

  const message = {
    from: "anilb9850@gmail.com",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
