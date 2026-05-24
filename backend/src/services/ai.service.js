import model from "../config/gemini.js";

import {
  getSummaryService,
  getCategoryBreakdownService,
  getBudgetStatusService,
  getTimelineSpendingService,
  getRecentTransactionsService,
} from "./analytics.service.js";

export const generateAIInsightsService =
  async (userId) => {
    // Fetch analytics data instead of raw DB access
    const summary =
      await getSummaryService(userId);

    const categoryBreakdown =
      await getCategoryBreakdownService(
        userId
      );

    const budgetStatus =
      await getBudgetStatusService(
        userId
      );

    const timeline =
      await getTimelineSpendingService(
        userId
      );

    // Format category breakdown
    const categoryText =
      categoryBreakdown.length > 0
        ? categoryBreakdown
            .map(
              (item) =>
                `${item.category}: ₹${item.total}`
            )
            .join("\n")
        : "No category spending data available.";

    // Format budget data
    const budgetText =
      budgetStatus.length > 0
        ? budgetStatus
            .map(
              (budget) =>
                `${budget.category} → Limit: ₹${budget.limit}, Spent: ₹${budget.spent}, Used: ${budget.percentageUsed.toFixed(
                  1
                )}%`
            )
            .join("\n")
        : "No budget data available.";

    // Recent spending trend
    const recentTrend =
      timeline.length > 0
        ? timeline
            .slice(-7)
            .map(
              (day) =>
                `${day.date}: ₹${day.total}`
            )
            .join("\n")
        : "No timeline data available.";

    const prompt = `
You are an intelligent fintech financial advisor AI.

Analyze the following financial analytics data and generate:

1. Spending insights
2. Budget warnings
3. Savings suggestions
4. Financial behavior observations

Keep the response:
- concise
- practical
- personalized
- easy to understand

Avoid generic advice.

========================
FINANCIAL SUMMARY
========================

Total Income: ₹${summary.income}

Total Expenses: ₹${summary.expense}

Balance: ₹${summary.balance}

========================
CATEGORY BREAKDOWN
========================

${categoryText}

========================
BUDGET STATUS
========================

${budgetText}

========================
RECENT SPENDING TREND
========================

${recentTrend}
`;

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    return response;
  };

export const financeChatService =
  async (userId, userMessage) => {
    // Fetch analytics data
    const summary =
      await getSummaryService(userId);

    const categoryBreakdown =
      await getCategoryBreakdownService(
        userId
      );

    const budgetStatus =
      await getBudgetStatusService(
        userId
      );

    const recentTransactions =
      await getRecentTransactionsService(
        userId
      );

    // Reduce payload size for cleaner prompting
    const simplifiedTransactions =
      recentTransactions.map(
        (transaction) => ({
          amount: transaction.amount,
          category:
            transaction.category,
          type: transaction.type,
          merchant:
            transaction.merchant,
          date: transaction.date,
        })
      );

    const prompt = `
You are an AI-powered fintech assistant.

Answer the user's financial question using ONLY the provided financial analytics data.

========================
FINANCIAL SUMMARY
========================

Income: ₹${summary.income}

Expenses: ₹${summary.expense}

Balance: ₹${summary.balance}

========================
CATEGORY BREAKDOWN
========================

${JSON.stringify(
  categoryBreakdown,
  null,
  2
)}

========================
BUDGET STATUS
========================

${JSON.stringify(
  budgetStatus,
  null,
  2
)}

========================
RECENT TRANSACTIONS
========================

${JSON.stringify(
  simplifiedTransactions,
  null,
  2
)}

========================
USER QUESTION
========================

${userMessage}

Instructions:
- Give concise financial answers
- Be practical and data-driven
- Avoid hallucinating fake financial data
- Use the provided analytics only
- Sound like a smart fintech advisor
`;

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    return response;
  };