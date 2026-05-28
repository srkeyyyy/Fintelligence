import api from "./api";

export const getSummary = async () => {
  const { data } = await api.get("/analytics/summary");
  return data;
};

export const getCategoryBreakdown = async () => {
  const { data } = await api.get("/analytics/category-breakdown");
  return data;
};

export const getTimeline = async () => {
  const { data } = await api.get("/analytics/timeline");
  return data;
};

export const getRecentTransactions = async () => {
  const { data } = await api.get("/analytics/recent");
  return data;
};

export const getBudgetStatus = async () => {
  const { data } = await api.get("/analytics/budget-status");
  return data;
};
