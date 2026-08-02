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
    $or: [{ googleId: payload.sub }, { email: payload.email }],
  });

  if (!user) {
    user = await User.create({
      googleId: payload.sub,
      fullName: payload.name,
      email: payload.email,
      avatar: payload.picture,
    });
  } else {
    if (!user.googleId) {
      user.googleId = payload.sub;
    }

    user.fullName = payload.name ?? user.fullName;
    user.avatar = payload.picture ?? user.avatar;

    await user.save();
  }

  return user;
};
