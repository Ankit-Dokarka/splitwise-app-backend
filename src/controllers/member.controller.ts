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
