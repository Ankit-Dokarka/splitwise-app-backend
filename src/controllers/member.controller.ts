import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as memberService from "../services/member.service.js";

export const getMembers = catchAsync(async (req: Request, res: Response) => {
  const members = await memberService.getMembers(req.user!._id.toString());

  res.status(200).json({
    success: true,
    members,
  });
});

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string" || q.trim().length < 1) {
    return res.status(200).json({
      success: true,
      users: [],
    });
  }

  const users = await memberService.searchUsers(
    req.user!._id.toString(),
    q.toString(),
  );

  res.status(200).json({
    success: true,
    users,
  });
});

export const addMember = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({
      success: false,
      message: "Member ID is required.",
    });
  }

  const member = await memberService.addMember(
    req.user!._id.toString(),
    memberId,
  );

  res.status(200).json({
    success: true,
    message: "Member added successfully.",
    member,
  });
});
