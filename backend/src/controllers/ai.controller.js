import {
  generateAIInsightsService,
  extractReceiptService,
  financeChatService,
} from "../services/ai.service.js";

export const getAIInsights = async (
  req,
  res
) => {
  try {
    const insights =
      await generateAIInsightsService(
        req.user.id
      );

    res.status(200).json({
      insights,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const chatWithAI = async (
  req,
  res
) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const response =
      await financeChatService(
        req.user.id,
        message
      );

    res.status(200).json({
      response,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const extractReceipt = async (
  req,
  res
) => {
  try {
    const receipt =
      await extractReceiptService(
        req.body
      );

    res.status(200).json({
      receipt,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
