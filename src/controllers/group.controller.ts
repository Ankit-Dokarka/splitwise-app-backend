import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as groupService from "../services/group.service.js";

export const createGroup = catchAsync(async (req: Request, res: Response) => {
  const { name, memberIds } = req.body;

  if (!name || !memberIds || !Array.isArray(memberIds)) {
    return res.status(400).json({
      success: false,
      message: "Group name and an array of memberIds are required.",
    });
  }

  const group = await groupService.createGroup(req.user!._id.toString(), {
    name,
    memberIds,
  });

  res.status(201).json({
    success: true,
    message: "Group created successfully.",
    group,
  });
});

export const getMyGroups = catchAsync(async (req: Request, res: Response) => {
  const groups = await groupService.getMyGroups(req.user!._id.toString());

  res.status(200).json({
    success: true,
    groups,
  });
});
