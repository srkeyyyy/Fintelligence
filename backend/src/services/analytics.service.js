import prisma from "../config/prisma.js";

export const getSummaryService = async (
  userId
) => {
  const incomeTransactions =
    await prisma.transaction.findMany({
      where: {
        userId,
        type: "income",
      },
    });

  const expenseTransactions =
    await prisma.transaction.findMany({
      where: {
        userId,
        type: "expense",
      },
    });

  const income = incomeTransactions.reduce(
    (sum, transaction) =>
      sum + transaction.amount,
    0
  );

  const expense = expenseTransactions.reduce(
    (sum, transaction) =>
      sum + transaction.amount,
    0
  );

  return {
    income,
    expense,
    balance: income - expense,
  };
};

export const getCategoryBreakdownService =
  async (userId) => {
    const transactions =
      await prisma.transaction.findMany({
        where: {
          userId,
          type: "expense",
        },
      });

    const categoryMap = {};

    transactions.forEach((transaction) => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }

      categoryMap[transaction.category] +=
        transaction.amount;
    });

    return Object.entries(categoryMap).map(
      ([category, total]) => ({
        category,
        total,
      })
    );
  };

export const getTimelineSpendingService =
  async (userId) => {
    const transactions =
      await prisma.transaction.findMany({
        where: {
          userId,
          type: "expense",
        },
        orderBy: {
          date: "asc",
        },
      });

    const timelineMap = {};

    transactions.forEach((transaction) => {
      const date =
        transaction.date.toISOString().split("T")[0];

      if (!timelineMap[date]) {
        timelineMap[date] = 0;
      }

      timelineMap[date] += transaction.amount;
    });

    return Object.entries(timelineMap).map(
      ([date, total]) => ({
        date,
        total,
      })
    );
  };

export const getRecentTransactionsService =
  async (userId) => {
    return await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });
  };

export const getBudgetStatusService =
  async (userId) => {
    const budgets =
      await prisma.budget.findMany({
        where: {
          userId,
        },
      });

    const categoryBudgets = [];

    const monthlyBudgets = [];

    for (const budget of budgets) {
      // CATEGORY BUDGET ANALYTICS
      if (budget.type === "category") {
        const transactions =
          await prisma.transaction.findMany({
            where: {
              userId,

              type: "expense",

              category:
                budget.category,

              date: {
                gte: new Date(
                  budget.year,
                  budget.month - 1,
                  1
                ),

                lt: new Date(
                  budget.year,
                  budget.month,
                  1
                ),
              },
            },
          });

        const spent = transactions.reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        );

        categoryBudgets.push({
          budgetId: budget.id,

          name: budget.name,

          category: budget.category,

          month: budget.month,

          year: budget.year,

          budgetAmount:
            budget.amount,

          spent,

          remaining:
            budget.amount - spent,

          percentageUsed:
            budget.amount === 0
              ? 0
              : Number(
                  (
                    (spent /
                      budget.amount) *
                    100
                  ).toFixed(1)
                ),

          exceeded:
            spent > budget.amount,
        });
      }

      // MONTHLY BUDGET ANALYTICS
      else if (
        budget.type === "monthly"
      ) {
        const transactions =
          await prisma.transaction.findMany({
            where: {
              userId,

              type: "expense",

              date: {
                gte: new Date(
                  budget.year,
                  budget.month - 1,
                  1
                ),

                lt: new Date(
                  budget.year,
                  budget.month,
                  1
                ),
              },
            },
          });

        const totalSpent =
          transactions.reduce(
            (sum, transaction) =>
              sum + transaction.amount,
            0
          );

        monthlyBudgets.push({
          budgetId: budget.id,

          name: budget.name,

          month: budget.month,

          year: budget.year,

          budgetAmount:
            budget.amount,

          totalSpent,

          remaining:
            budget.amount -
            totalSpent,

          percentageUsed:
            budget.amount === 0
              ? 0
              : Number(
                  (
                    (totalSpent /
                      budget.amount) *
                    100
                  ).toFixed(1)
                ),

          exceeded:
            totalSpent >
            budget.amount,
        });
      }
    }

    return {
      categoryBudgets,
      monthlyBudgets,
    };
  };