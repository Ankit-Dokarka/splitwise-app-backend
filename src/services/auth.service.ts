import { env } from "../config/env.js";
import googleClient from "../config/google.js";

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

  return {
    success: true,
    message: "Google token verified successfully.",
    user: {
      googleId: payload.sub,
      fullName: payload.name,
      email: payload.email,
      avatar: payload.picture,
      emailVerified: payload.email_verified,
    },
  };
};
