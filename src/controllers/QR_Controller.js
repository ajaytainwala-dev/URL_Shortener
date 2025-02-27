import express from "express";
import  generateQRCode  from "../utils/QR_Service.js";

const generateQR = async (req, res) => {
    try {
        const url  = req.query.url;
        if (!url) {
            return res.status(400).json({ message: "Please enter a URL" });
        }
        const qrCode = await generateQRCode(url);
        res.setHeader("Content-Disposition", "attachment; filename=qrcode.png");
        res.status(200).type("image/png").send(qrCode);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export default generateQR;