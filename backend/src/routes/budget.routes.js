import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";
import {
  cacheResponse,
  invalidateUserCacheOnSuccess,
} from "../middleware/cache.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", invalidateUserCacheOnSuccess(), createBudget);

router.get("/", cacheResponse(120), getBudgets);

router.patch("/:id", invalidateUserCacheOnSuccess(), updateBudget);

router.delete("/:id", invalidateUserCacheOnSuccess(), deleteBudget);

export default router;
