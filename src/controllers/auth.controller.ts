import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";
import { env } from "../config/env.js";

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.googleAuth(req.body);

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Google login successful.",
    user,
  });
});

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};
