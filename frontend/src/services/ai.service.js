import api from "./api";

export const getAIInsights = async () => {
  const { data } = await api.get("/ai/insights");
  return data;
};

export const chatWithAI = async (message) => {
  const { data } = await api.post("/ai/chat", { message });
  return data;
};

export const extractReceipt = async (payload) => {
  const { data } = await api.post("/ai/extract-receipt", payload);
  return data;
};
