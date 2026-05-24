import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getAIInsights,
  chatWithAI,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/insights", getAIInsights);

router.post("/chat", chatWithAI);

export default router;