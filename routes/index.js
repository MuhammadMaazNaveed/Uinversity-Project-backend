const express = require("express");
const router = express.Router();
const Routes = require("../controllers/user.js");
const middleware = require("../middleware/validater.js");
const { isResetTokenValid } = require("../middleware/user.js");

// For signup
router.post(
  "/create",
  middleware.validateUser,
  middleware.validate,
  Routes.createUser
);

// For signin
router.post("/signin", Routes.signin);
// router.post("/createAdmin", Routes.createAdmin);
// router.post("/admin", Routes.adminSignin);
// For Email verified
router.post("/verify-email", Routes.verifyEmail);
// For Change Password
router.post("/forget-password", Routes.Forgetpassword);
router.post("/reset-password", isResetTokenValid, Routes.resetpassword);
// For Get token
router.get("/verify-token", isResetTokenValid, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
