import {
  createBudgetService,
  getBudgetsService,
  updateBudgetService,
  deleteBudgetService,
} from "../services/budget.service.js";

export const createBudget = async (
  req,
  res
) => {
  try {
    const budget =
      await createBudgetService(
        req.user.id,
        req.body
      );

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getBudgets = async (
  req,
  res
) => {
  try {
    const budgets =
      await getBudgetsService(req.user.id);

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBudget = async (
  req,
  res
) => {
  try {
    const updatedBudget =
      await updateBudgetService(
        req.user.id,
        req.params.id,
        req.body
      );

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBudget = async (
  req,
  res
) => {
  try {
    const response =
      await deleteBudgetService(
        req.user.id,
        req.params.id
      );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};