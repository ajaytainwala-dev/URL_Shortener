import express from "express";
import User from "../Database/models/User.js";
import  URL from "../Database/models/URL.js";
import authMiddleware from "../middlewares/middleware.js";
const router = express.Router();

router.get("/page/profile",(req,res)=>{
    res.render("profile.ejs");
});

router.get("/api/profile", authMiddleware, async (req,res)=>{
    const user = req.user;
    const userData = await User.findById(user.id).select("-password");
    if (!userData) {
        return res.status(404).json({ message: "User not found" });
    }
    const userURLs = await URL.find({ user: user.id });
    res.json({  user: userData, userURLs: userURLs });
}) ;

export default router;