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

export const addMember = async (currentUserId: string, memberId: string) => {
  const currentUser = await User.findById(currentUserId);
  const memberToAdd = await User.findById(memberId);

  if (!currentUser) {
    throw new Error("User not found.");
  }

  if (!memberToAdd) {
    throw new Error("Member to add not found.");
  }

  if (currentUserId === memberId) {
    throw new Error("You cannot add yourself as a member.");
  }

  const alreadyMember = currentUser.members.some(
    (id) => id.toString() === memberId,
  );

  if (alreadyMember) {
    throw new Error("This user is already in your members list.");
  }

  currentUser.members.push(memberToAdd._id);
  await currentUser.save();

  return memberToAdd;
};
