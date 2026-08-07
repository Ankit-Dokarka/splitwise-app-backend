import { Types } from "mongoose";
import Expense from "../models/expense.model.js";
import Group from "../models/group.model.js";
import { UserDocument } from "../models/user.model.js";

type CreateExpenseInput = {
  title: string;
  description: string;
  amount: number;
  groupId: string;
  paidBy: string;
  participantIds: string[];
};

export const createExpense = async (
  currentUserId: string,
  data: CreateExpenseInput,
) => {
  const { title, description, amount, groupId, paidBy, participantIds } = data;

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (!participantIds || participantIds.length === 0) {
    throw new Error("At least one participant is required.");
  }

  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found.");
  }

  if (!group.members.some((id) => id.toString() === currentUserId)) {
    throw new Error("You are not a member of this group.");
  }

  if (!group.members.some((id) => id.toString() === paidBy)) {
    throw new Error("Payer must be a member of the group.");
  }

  const finalParticipantIds = Array.from(new Set([...participantIds, paidBy]));

  for (const pId of finalParticipantIds) {
    if (!group.members.some((id) => id.toString() === pId)) {
      throw new Error("All participants must be members of the group.");
    }
  }

  const numParticipants = finalParticipantIds.length;
  const baseShare = Math.floor((amount / numParticipants) * 100) / 100;
  const totalDistributed = baseShare * numParticipants;
  const remainder = Math.round((amount - totalDistributed) * 100) / 100;

  const participantShares = finalParticipantIds.map((userId) => {
    let share = baseShare;
    if (userId === paidBy) {
      share += remainder;
    }
    return { user: new Types.ObjectId(userId), share };
  });

  const expense = await Expense.create({
    title,
    description,
    amount,
    groupId: new Types.ObjectId(groupId),
    paidBy: new Types.ObjectId(paidBy),
    participants: participantShares,
    createdBy: new Types.ObjectId(currentUserId),
  });

  return expense;
};

export const getGroupExpensesAndBalances = async (
  currentUserId: string,
  groupId: string,
) => {
  const group = await Group.findById(groupId).populate(
    "members",
    "fullName email avatar",
  );

  if (!group) {
    throw new Error("Group not found.");
  }

  const populatedMembers = group.members as unknown as UserDocument[];

  const isMember = populatedMembers.some(
    (member) => member._id.toString() === currentUserId,
  );
  if (!isMember) {
    throw new Error("You are not authorized to view this group.");
  }

  const expenses = await Expense.find({ groupId })
    .populate("paidBy", "fullName email avatar")
    .populate("participants.user", "fullName email avatar")
    .sort({ createdAt: -1 });

  const userBalances: Record<
    string,
    { user: UserDocument; totalPaid: number; totalShare: number }
  > = {};

  populatedMembers.forEach((member) => {
    userBalances[member._id.toString()] = {
      user: member,
      totalPaid: 0,
      totalShare: 0,
    };
  });

  for (const exp of expenses) {
    const paidByUser = exp.paidBy as unknown as UserDocument;
    const paidById = paidByUser._id.toString();

    if (userBalances[paidById]) {
      userBalances[paidById].totalPaid += exp.amount;
    }

    for (const p of exp.participants) {
      const participantUser = p.user as unknown as UserDocument;
      const pId = participantUser._id.toString();
      if (userBalances[pId]) {
        userBalances[pId].totalShare += p.share;
      }
    }
  }

  const balances = Object.values(userBalances).map((b) => {
    const netBalance = Math.round((b.totalPaid - b.totalShare) * 100) / 100;
    return {
      user: b.user,
      totalPaid: b.totalPaid,
      totalShare: b.totalShare,
      toReceive: netBalance > 0 ? netBalance : 0,
      toPay: netBalance < 0 ? Math.abs(netBalance) : 0,
    };
  });

  return { group, expenses, balances };
};
