import express from "express";
import { getContacts,createContact} from "../controllers/contactController.js";
const router = express.Router();

router.get("/page/contact", getContacts);
router.post("/api/contact", createContact);

export default router;