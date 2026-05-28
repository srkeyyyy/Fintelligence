import api from "./api";

export const getBudgets = async () => {
  const { data } = await api.get("/budgets");
  return data;
};

export const createBudget = async (payload) => {
  const { data } = await api.post("/budgets", {
    ...payload,
    amount: Number(payload.amount),
    month: Number(payload.month),
    year: Number(payload.year),
    category: payload.type === "monthly" ? null : payload.category,
  });
  return data;
};

export const deleteBudget = async (id) => {
  const { data } = await api.delete(`/budgets/${id}`);
  return data;
};
