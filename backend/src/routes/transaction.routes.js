import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTransaction);

router.get("/", getTransactions);

router.get("/:id", getTransactionById);

router.patch("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

export default router;