import express from "express";
import {
  register,
  login,
  doLogin,
  doRegister,
  forgetPassword,
  resetPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.get("/page/login", login);
router.get("/page/register", register);

router.post("/api/login", doLogin);
router.post("/api/register", doRegister);

router.post("/forgotpassword", forgetPassword);
router.get("/resetpassword/:resetToken", (req, res) => {
  res.render("resetPass.ejs", { resetToken: req.params.resetToken });
});
router.get("/page/forgotpassword", (req, res) => {
  res.render("forgotPass.ejs");
});
// ROUTE 7 : get logged in user details using: POST /api/auth/getuser "login required"
router.put("/resetpassword/:resetToken", resetPassword);
export default router;
