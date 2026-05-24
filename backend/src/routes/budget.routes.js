import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createBudget);

router.get("/", getBudgets);

router.patch("/:id", updateBudget);

router.delete("/:id", deleteBudget);

export default router;