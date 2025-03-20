import express from "express";
import { shortenURL,redirectURL,deleteURL } from "../controllers/urlController.js";
import authMiddleware from "../middlewares/middleware.js";
const router = express.Router();

router.get("/page/url", (req, res) => {
  const longURL = req.query.q;
  res.render("url", { longURL });
});

router.post("/api/url/:longURL", authMiddleware, shortenURL);
router.get("/:shortURL", 
   redirectURL);
router.delete("/api/url/:urlId",authMiddleware, deleteURL);
export default router;
