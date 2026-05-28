import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  extractReceipt,
  getAIInsights,
  chatWithAI,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/insights", getAIInsights);

router.post("/chat", chatWithAI);

router.post("/extract-receipt", extractReceipt);

export default router;
