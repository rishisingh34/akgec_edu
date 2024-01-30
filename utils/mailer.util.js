const mailer = require("nodemailer");
const { EMAIL, PASS } = require("../config/env.config");

const sendMail = async (email, name) => {
  const transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "",
    html: ``,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent : " + info.response);
    }
  });
};

module.exports = { sendMail };
