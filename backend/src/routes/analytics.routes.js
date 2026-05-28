import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getSummary,
  getCategoryBreakdown,
  getTimelineSpending,
  getRecentTransactions,
  getBudgetStatus,
} from "../controllers/analytics.controller.js";
import { cacheResponse } from "../middleware/cache.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", cacheResponse(300), getSummary);

router.get(
  "/category-breakdown",
  cacheResponse(300),
  getCategoryBreakdown
);

router.get("/timeline", cacheResponse(300), getTimelineSpending);

router.get("/recent", cacheResponse(120), getRecentTransactions);

router.get("/budget-status", cacheResponse(300), getBudgetStatus);

export default router;
