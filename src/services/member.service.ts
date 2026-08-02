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

export const searchUsers = async (currentUserId: string, query: string) => {
  const regex = new RegExp(query, "i");

  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [{ email: regex }, { fullName: regex }],
  })
    .select("fullName email avatar")
    .limit(10);

  return users;
};
