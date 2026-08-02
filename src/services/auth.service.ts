import googleClient from "../config/google.js";
import { env } from "../config/env.js";
import User from "../models/user.model.js";

type GoogleAuthBody = {
  idToken: string;
};

export const googleAuth = async ({ idToken }: GoogleAuthBody) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Failed to verify Google token.");
  }

  let user = await User.findOne({
    googleId: payload.sub,
  });

  if (!user) {
    user = await User.create({
      googleId: payload.sub,
      fullName: payload.name,
      email: payload.email,
      avatar: payload.picture,
    });
  }

  return {
    success: true,
    message: "Google login successful.",
    user,
  };
};
