import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as memberService from "../services/member.service.js";

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
