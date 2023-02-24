const User = require("../models/userSchema.js");
const ResetToken = require("../models/resetToken.js");

const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper.js");

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || !id) return sendError(res, "invalid request!");

  if (!isValidObjectId(id)) return sendError(res, "invalid user!");

  const user = await User.findById(id);
  if (!user) return sendError(res, "user not found!");

  const resetToken = await ResetToken.findOne({ owner: user._id });
  if (!resetToken) return sendError(res, "Reset token not found!");

  const isValid = await resetToken.compareToken(token);
  if (!isValid) return sendError(res, "Reset token is not anvalid!");

  req.user = user;
  next();
};
