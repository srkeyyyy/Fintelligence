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
You are MonAI, an intelligent fintech financial advisor.

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
- formatted with short lines and bullet points when useful

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
You are MonAI, an AI-powered fintech assistant.

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
- Format the answer with short paragraphs or bullet points when useful
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

const extractJsonObject = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Could not read receipt details");
  }

  return JSON.parse(jsonMatch[0]);
};

export const extractReceiptService = async ({
  imageBase64,
  mimeType,
}) => {
  if (!imageBase64 || !mimeType) {
    throw new Error("Receipt image is required");
  }

  const prompt = `
You are extracting transaction fields from a receipt or payment screenshot.

Return ONLY valid JSON. Do not wrap it in markdown.

Schema:
{
  "amount": number | null,
  "category": string | null,
  "date": "YYYY-MM-DD" | null,
  "description": string | null,
  "merchant": string | null,
  "type": "expense" | "income" | null,
  "confidence": {
    "amount": "high" | "medium" | "low" | "none",
    "category": "high" | "medium" | "low" | "none",
    "date": "high" | "medium" | "low" | "none",
    "merchant": "high" | "medium" | "low" | "none"
  },
  "missingFields": string[]
}

Rules:
- Do not infer today's date, upload date, or current date.
- If a field is not visible or not clearly supported by the image, return null.
- Prefer the final paid/grand total for amount. Ignore phone numbers, GSTIN, invoice numbers, table numbers, item quantities, and card digits.
- Use expense for purchases, bills, UPI payments, card payments, and receipts.
- Use income only if the image clearly indicates money received/refund/credit.
- Category should be short, like Food, Travel, Shopping, Groceries, Utilities, Healthcare, Entertainment, Salary, Refund, or Other.
- Description should be a short human-readable summary using only visible details.
`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const response = result.response.text();
  const parsed = extractJsonObject(response);

  return {
    amount:
      typeof parsed.amount === "number"
        ? parsed.amount
        : null,
    category:
      typeof parsed.category === "string"
        ? parsed.category
        : null,
    confidence: parsed.confidence || {},
    date:
      typeof parsed.date === "string"
        ? parsed.date
        : null,
    description:
      typeof parsed.description === "string"
        ? parsed.description
        : null,
    merchant:
      typeof parsed.merchant === "string"
        ? parsed.merchant
        : null,
    missingFields: Array.isArray(parsed.missingFields)
      ? parsed.missingFields
      : [],
    type:
      parsed.type === "income" || parsed.type === "expense"
        ? parsed.type
        : null,
  };
};
