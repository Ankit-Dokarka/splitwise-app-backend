import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";
import { cookieOptions } from "../config/cookie.js";

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.googleAuth(req.body);

  const token = generateToken(user._id.toString());

  res.cookie("accessToken", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Google login successful.",
    user,
  });
});

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("accessToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const checkAuth = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
