import { Request, Response } from "express";

import catchAsync from "../utils/catchAsync.js";

import * as userService from "../services/user.service.js";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(
    req.user!._id.toString(),
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user,
  });
});

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded.",
    });
  }

  const user = await userService.updateAvatar(
    req.user!._id.toString(),
    req.file.buffer,
  );

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully.",
    user,
  });
});
