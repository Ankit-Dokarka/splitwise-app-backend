import Group from "../models/group.model.js";

type CreateGroupInput = {
  name: string;
  memberIds: string[];
};

export const createGroup = async (
  currentUserId: string,
  data: CreateGroupInput,
) => {
  const { name, memberIds } = data;

  if (!name || name.trim().length === 0) {
    throw new Error("Group name is required.");
  }

  if (!memberIds || memberIds.length === 0) {
    throw new Error("At least one member is required to create a group.");
  }

  const allMemberIds = Array.from(new Set([currentUserId, ...memberIds]));

  const group = await Group.create({
    name,
    createdBy: currentUserId,
    members: allMemberIds,
  });

  await group.populate("members", "fullName email avatar");
  await group.populate("createdBy", "fullName email avatar");

  return group;
};

export const getMyGroups = async (currentUserId: string) => {
  const groups = await Group.find({ members: currentUserId })
    .populate("members", "fullName email avatar")
    .populate("createdBy", "fullName email avatar")
    .sort({ createdAt: -1 });

  return groups;
};
