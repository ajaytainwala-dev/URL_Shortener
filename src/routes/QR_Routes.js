import express from "express";
import generateQR  from "../controllers/QR_Controller.js";

const router = express.Router();

router.post("/api/qr/", generateQR);

export default router;