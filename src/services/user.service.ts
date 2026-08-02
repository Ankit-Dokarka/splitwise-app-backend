import User from "../models/user.model.js";

type UpdateProfileBody = {
  fullName: string;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileBody,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.fullName = data.fullName;

  await user.save();

  return user;
};
