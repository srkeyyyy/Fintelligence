import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import {
  cacheResponse,
  invalidateUserCacheOnSuccess,
} from "../middleware/cache.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", invalidateUserCacheOnSuccess(), createTransaction);

router.get("/", cacheResponse(120), getTransactions);

router.get("/:id", getTransactionById);

router.patch("/:id", invalidateUserCacheOnSuccess(), updateTransaction);

router.delete("/:id", invalidateUserCacheOnSuccess(), deleteTransaction);

export default router;
