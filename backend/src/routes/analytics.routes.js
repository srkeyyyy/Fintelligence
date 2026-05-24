import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getSummary,
  getCategoryBreakdown,
  getTimelineSpending,
  getRecentTransactions,
  getBudgetStatus,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", getSummary);

router.get("/category-breakdown", getCategoryBreakdown);

router.get("/timeline", getTimelineSpending);

router.get("/recent", getRecentTransactions);

router.get("/budget-status", getBudgetStatus);

export default router;