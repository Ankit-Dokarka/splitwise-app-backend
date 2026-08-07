import User from "../models/user.model.js";

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
