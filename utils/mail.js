const nodemailer = require("nodemailer");

let otp = "";
exports.generateOtp = () => {
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

exports.mailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "503b2467391036",
      pass: "08bc03e4225cab",
    },
  });
