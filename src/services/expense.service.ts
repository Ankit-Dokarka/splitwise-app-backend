import { Types } from "mongoose";
import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";

type CreateExpenseInput = {
  description: string;
  amount: number;
  memberId: string;
  paidBy: string;
};

export const createExpense = async (
  currentUserId: string,
  data: CreateExpenseInput,
) => {
  const { description, amount, memberId, paidBy } = data;

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (paidBy !== currentUserId && paidBy !== memberId) {
    throw new Error(
      "Invalid payer. Payer must be a participant in the expense.",
    );
  }

  const currentUser = await User.findById(currentUserId);

  if (
    !currentUser ||
    !currentUser.members.some((id) => id.toString() === memberId)
  ) {
    throw new Error("You can only add expenses with your members.");
  }

  const participants = [currentUserId, memberId];
  const numParticipants = participants.length;

  const baseShare = Math.floor((amount / numParticipants) * 100) / 100;
  const totalDistributed = baseShare * numParticipants;
  const remainder = Math.round((amount - totalDistributed) * 100) / 100;

  const participantShares = participants.map((userId) => {
    let share = baseShare;

    if (userId === paidBy) {
      share += remainder;
    }
    return { user: new Types.ObjectId(userId), share };
  });

  const expense = await Expense.create({
    description,
    amount,
    currency: "INR",
    paidBy: new Types.ObjectId(paidBy),
    participants: participantShares,
    splitType: "equal",
    createdBy: new Types.ObjectId(currentUserId),
  });

  return expense;
};

export const getMyExpenses = async (currentUserId: string) => {
  const expenses = await Expense.find({
    "participants.user": currentUserId,
  })
    .populate("paidBy", "fullName email avatar")
    .populate("participants.user", "fullName email avatar")
    .sort({ createdAt: -1 });

  const balances: Record<string, { user: any; amount: number }> = {};

  for (const exp of expenses) {
    const myShareObj = exp.participants.find(
      (p) => p.user._id.toString() === currentUserId,
    );
    const myShare = myShareObj ? myShareObj.share : 0;

    let netChange = 0;
    if (exp.paidBy._id.toString() === currentUserId) {
      netChange = exp.amount - myShare;
    } else {
      netChange = -myShare;
    }

    const otherParticipant = exp.participants.find(
      (p) => p.user._id.toString() !== currentUserId,
    );

    if (otherParticipant) {
      const otherId = otherParticipant.user._id.toString();
      if (!balances[otherId]) {
        balances[otherId] = {
          user: otherParticipant.user,
          amount: 0,
        };
      }
      balances[otherId].amount += netChange;
    }
  }

  const balanceSummary = Object.values(balances).map((b) => ({
    user: b.user,
    amount: Math.round(b.amount * 100) / 100,
  }));

  return { expenses, balances: balanceSummary };
};
