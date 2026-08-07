import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as expenseService from "../services/expense.service.js";

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const { description, amount, groupId, paidBy, participantIds } = req.body;

  if (!description || !amount || !groupId || !paidBy || !participantIds) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: description, amount, groupId, paidBy, participantIds",
    });
  }

  const expense = await expenseService.createExpense(req.user!._id.toString(), {
    description,
    amount,
    groupId,
    paidBy,
    participantIds,
  });

  res.status(201).json({
    success: true,
    message: "Expense added successfully.",
    expense,
  });
});

export const getGroupExpenses = catchAsync(
  async (req: Request, res: Response) => {
    const groupId = req.params.groupId as string;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required.",
      });
    }

    const data = await expenseService.getGroupExpensesAndBalances(
      req.user!._id.toString(),
      groupId,
    );

    res.status(200).json({
      success: true,
      ...data,
    });
  },
);
