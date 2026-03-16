import express from "express";
import { geminiChat } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/chat", geminiChat);

export default router;