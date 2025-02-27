import express from "express";
import { shortenURL,redirectURL } from "../controllers/urlController.js";
import authMiddleware from "../middlewares/middleware.js";
import trackAnalytics from "../middlewares/URL_Analytics.js";
const router = express.Router();

router.get("/page/url", (req, res) => {
  const longURL = req.query.q;
  res.render("url", { longURL });
});

router.post("/api/url/:longURL", authMiddleware, shortenURL);
router.get("/:shortURL", trackAnalytics, redirectURL);
export default router;
