import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as expenseService from "../services/expense.service.js";

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const { description, amount, memberId, paidBy } = req.body;

  if (!description || !amount || !memberId || !paidBy) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: description, amount, memberId, paidBy",
    });
  }

  const expense = await expenseService.createExpense(req.user!._id.toString(), {
    description,
    amount,
    memberId,
    paidBy,
  });

  res.status(201).json({
    success: true,
    message: "Expense added successfully.",
    expense,
  });
});

export const getMyExpenses = catchAsync(async (req: Request, res: Response) => {
  const data = await expenseService.getMyExpenses(req.user!._id.toString());

  res.status(200).json({
    success: true,
    ...data,
  });
});
