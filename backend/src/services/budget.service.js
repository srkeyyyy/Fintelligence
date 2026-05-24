import prisma from "../config/prisma.js";

export const createBudgetService =
  async (userId, data) => {
    const {
      name,
      category,
      amount,
      type,
      month,
      year,
    } = data;

    // COMMON VALIDATION
    if (
      !name ||
      !amount ||
      !type ||
      !month ||
      !year
    ) {
      throw new Error(
        "Missing required fields"
      );
    }

    // VALID TYPES
    if (
      type !== "category" &&
      type !== "monthly"
    ) {
      throw new Error(
        "Invalid budget type"
      );
    }

    // CATEGORY BUDGET VALIDATION
    if (
      type === "category" &&
      !category
    ) {
      throw new Error(
        "Category is required for category budgets"
      );
    }

    // MONTHLY BUDGET
    const normalizedCategory =
      type === "monthly"
        ? null
        : category;

    // DUPLICATE CHECK
    const existingBudget =
      await prisma.budget.findFirst({
        where: {
          userId,
          category:
            normalizedCategory,
          month,
          year,
          type,
        },
      });

    if (existingBudget) {
      throw new Error(
        "Budget already exists"
      );
    }

    // CREATE
    const budget =
      await prisma.budget.create({
        data: {
          name,
          category:
            normalizedCategory,
          amount,
          type,
          month,
          year,
          userId,
        },
      });

    return budget;
  };

export const getBudgetsService =
  async (userId) => {
    return await prisma.budget.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const updateBudgetService =
  async (
    userId,
    budgetId,
    data
  ) => {
    const existingBudget =
      await prisma.budget.findFirst({
        where: {
          id: budgetId,
          userId,
        },
      });

    if (!existingBudget) {
      throw new Error(
        "Budget not found"
      );
    }

    // CATEGORY BUDGET MUST HAVE CATEGORY
    if (
      existingBudget.type ===
        "category" &&
      data.category === null
    ) {
      throw new Error(
        "Category budget must contain category"
      );
    }

    // MONTHLY BUDGET MUST NOT HAVE CATEGORY
    if (
      existingBudget.type ===
      "monthly"
    ) {
      data.category = null;
    }

    const updatedBudget =
      await prisma.budget.update({
        where: {
          id: budgetId,
        },

        data,
      });

    return updatedBudget;
  };

export const deleteBudgetService =
  async (
    userId,
    budgetId
  ) => {
    const existingBudget =
      await prisma.budget.findFirst({
        where: {
          id: budgetId,
          userId,
        },
      });

    if (!existingBudget) {
      throw new Error(
        "Budget not found"
      );
    }

    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });

    return {
      message:
        "Budget deleted successfully",
    };
  };