import googleClient from "../config/google.js";

export const googleAuth = async (body: { idToken: string }) => {
  const { idToken } = body;

  const ticket = await googleClient.verifyIdToken({
    idToken,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Unable to verify Google token.");
  }

  return {
    success: true,
    data: payload,
  };
};
