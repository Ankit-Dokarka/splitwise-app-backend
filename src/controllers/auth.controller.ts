import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.googleAuth(req.body);

  res.status(200).json(result);
});
