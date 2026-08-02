import User from "../models/user.model.js";

export const getMembers = async (currentUserId: string) => {
  const user = await User.findById(currentUserId).populate(
    "members",
    "fullName email avatar",
  );

  if (!user) {
    throw new Error("User not found.");
  }

  return user.members;
};
