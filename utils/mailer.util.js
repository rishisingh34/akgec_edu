const mailer = require("nodemailer");
const { EMAIL, PASS } = require("../config/env.config");

const sendMail = async (otp,subject,user,email) => {
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
    subject: subject,
    html: `<p style="font-size: 20px">Hello ${user},<br>Here is your OTP:<br><b>${otp}</b><br><br>This OTP is valid till 10 minutes.</p>`,
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
