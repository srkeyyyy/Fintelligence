import {
  createTransactionService,
  getTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
} from "../services/transaction.service.js";

export const createTransaction = async (req, res) => {
  try {
    const transaction = await createTransactionService(
      req.user.id,
      req.body
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsService(
      req.user.id
    );

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await getTransactionByIdService(
      req.user.id,
      req.params.id
    );

    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await updateTransactionService(
      req.user.id,
      req.params.id,
      req.body
    );

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const result = await deleteTransactionService(
      req.user.id,
      req.params.id
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};