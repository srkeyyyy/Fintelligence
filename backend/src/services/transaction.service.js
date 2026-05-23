import prisma from "../config/prisma.js";

export const createTransactionService = async (
  userId,
  data
) => {
  const {
    amount,
    category,
    type,
    merchant,
    description,
  } = data;

  if (!amount || !category || !type) {
    throw new Error("Required fields missing");
  }

  if (!["income", "expense"].includes(type)) {
    throw new Error("Invalid transaction type");
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      category,
      type,
      merchant,
      description,
      userId,
    },
  });

  return transaction;
};

export const getTransactionsService = async (
  userId
) => {
  return await prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTransactionByIdService = async (
  userId,
  transactionId
) => {
  const transaction =
    await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};

export const updateTransactionService = async (
  userId,
  transactionId,
  data
) => {
  const existingTransaction =
    await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  return await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data,
  });
};

export const deleteTransactionService = async (
  userId,
  transactionId
) => {
  const existingTransaction =
    await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  return {
    message: "Transaction deleted successfully",
  };
};