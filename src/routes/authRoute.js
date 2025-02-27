import express from "express";
import {
  register,
  login,
  doLogin,
  doRegister,
} from "../controllers/authController.js";
const router = express.Router();

router.get("/page/login", login);
router.get("/page/register", register);

router.post("/api/login", doLogin);
router.post("/api/register", doRegister);
export default router;
