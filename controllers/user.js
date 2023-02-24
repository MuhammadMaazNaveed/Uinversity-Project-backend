const User = require("../models/userSchema.js");
const Admin = require("../models/adminSchema.js");
const { sendError, createRandomBytes } = require("../utils/helper.js");
const JWT = require("jsonwebtoken");
const { generateOtp, mailTransport } = require("../utils/mail.js");
const verificationTokenGenerater = require("../models/verficationToken.js");
const VerificationToken = require("../models/verficationToken.js");
const ResetToken = require("../models/resetToken.js");
const { isValidObjectId } = require("mongoose");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return sendError(res, "This Email is already exist");
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();

  const OTP = generateOtp();
  const verificationToken = new verificationTokenGenerater({
    owner: newUser._id,
    token: OTP,
  });
  await verificationToken.save();

  mailTransport().sendMail({
    from: "emailverication@email.com",
    to: newUser.email,
    subject: "Verify your email account",
    html: `<h1>${OTP}</h1>`,
  });
  res.json({
    success: true,
    user: {
      name: newUser.name,
      email: newUser.email,
      id: newUser._id,
      password: newUser.password,
      verified: newUser.verified,
    },
  });
};
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (user) return sendError(res, "This Email is already exist");
  const newAdmin = new Admin({
    name,
    email,
    password,
  });

  const OTP = generateOtp();
  const verificationToken = new verificationTokenGenerater({
    owner: newAdmin._id,
    token: OTP,
  });
  await verificationToken.save();
  await newAdmin.save();

  mailTransport().sendMail({
    from: "emailverication@email.com",
    to: newUser.email,
    subject: "Verify your email account",
    html: `<h1>${OTP}</h1>`,
  });
  res.json({
    success: true,
    user: {
      name: newAdmin.name,
      email: newAdmin.email,
      id: newAdmin._id,
      verified: newAdmin.verified,
    },
  });
};

// for signin
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim())
      return sendError(res, "email/password missing!");
    const user = await User.findOne({ email });
    if (!user) return sendError(res, "user not found");

    const isMatched = await user.comparePassword(password);
    if (!isMatched) return sendError(res, "email/password doesn't match");

    const token = JWT.sign(
      { userId: user._id },
      "FOiidkshyiudksnkfjuklsjoiuddshdi",
      {
        expiresIn: "1d",
      }
    );
    res.json({
      success: true,
      user: { name: user.name, email: user.email, id: user._id, token: token },
    });
  } catch (error) {
    sendError(res, err.message, 500);
  }
};
const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim())
      return sendError(res, "email/password missing!");
    const admin = await Admin.findOne({ email });
    if (!admin) return sendError(res, "user not found");

    const isMatched = await admin.comparePassword(password);
    if (!isMatched) return sendError(res, "email/password doesn't match");

    const token = JWT.sign(
      { userId: admin._id },
      "FOiidkshyiudksnkfjuklsjoiuddshdi",
      {
        expiresIn: "1d",
      }
    );
    res.json({
      success: true,
      user: {
        name: admin.name,
        email: admin.email,
        id: admin._id,
        token: token,
      },
    });
  } catch (error) {
    sendError(res, err.message, 500);
  }
};
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp.trim())
    return sendError(res, "Invalid request, missing parameter!");

  if (!isValidObjectId(userId)) return sendError(res, "Invalid userId!");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Sorry, user not found!");

  if (user.verified) return sendError(res, "This account in already verified!");

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "Sorry, user not found!");

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, "Please provide a valid token!");

  user.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: "emailverication@email.com",
    to: user.email,
    subject: "Welcome email",
    html: `<h1>Email verified Successfully</h1>
    <h1>Thanks for connecting with us</h1>`,
  });

  res.json({
    success: true,
    message: "Your email is verified",
    user: { name: user.name, email: user.email, id: user._id },
  });
};

const Forgetpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Please provide a valid email");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "user not found, invalid request!");

  const token = await ResetToken.findOne({ owner: user._id });
  if (token)
    return sendError(
      res,
      "Only after one hour you can request for another token!"
    );

  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
  await resetToken.save();
  mailTransport().sendMail({
    from: "security@email.com",
    to: user.email,
    subject: "Password reset",
    html: `<a>http://localhost:3000/reset-password?token=${randomBytes}&id=${user._id}</a>`,
  });

  res.json({
    success: true,
    message: "Password reset link is sent to your email.",
  });
};
const resetpassword = async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "user not Found!");

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword)
    return sendError(res, "New Password must be the different!");

  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "Password must be 8 to 20 character long!");

  user.password = password.trim();
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });
  mailTransport().sendMail({
    from: "security@email.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `<h1>Password Reset Successfully</h1>
    <h1>Now you can login with new password!</h1>`,
  });

  res.json({ success: true, message: "Password Reset Successfully" });
};

module.exports = {
  createUser,
  signin,
  verifyEmail,
  Forgetpassword,
  resetpassword,
  adminSignin,
  createAdmin,
};
