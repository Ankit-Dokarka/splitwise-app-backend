import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import User from "../models/user.model.js";

type TokenPayload = {
  userId: string;
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { userId } = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default protect;
