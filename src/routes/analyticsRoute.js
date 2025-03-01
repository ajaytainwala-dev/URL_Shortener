import express from "express"
import { getAnalytics } from "../controllers/analyticsController.js"
// import authMiddleware from "../middlewares/middleware.js"
const router = express.Router()

router.get("/analyze/:shortUrlId", getAnalytics);

export default router;
