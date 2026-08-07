import { Router } from "express";
import protect from "../middleware/protect.js";
import * as expenseController from "../controllers/expense.controller.js";

const router = Router();

router.post("/", protect, expenseController.createExpense);

router.get("/:groupId", protect, expenseController.getGroupExpenses);

export default router;
