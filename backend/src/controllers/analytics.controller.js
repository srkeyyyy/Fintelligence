import {
  getSummaryService,
  getCategoryBreakdownService,
  getTimelineSpendingService,
  getRecentTransactionsService,
  getBudgetStatusService,
} from "../services/analytics.service.js";

export const getSummary = async (req, res) => {
  try {
    const data = await getSummaryService(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategoryBreakdown = async (
  req,
  res
) => {
  try {
    const data =
      await getCategoryBreakdownService(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTimelineSpending = async (
  req,
  res
) => {
  try {
    const data =
      await getTimelineSpendingService(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecentTransactions = async (
  req,
  res
) => {
  try {
    const data =
      await getRecentTransactionsService(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBudgetStatus = async (
  req,
  res
) => {
  try {
    const data =
      await getBudgetStatusService(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};