import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

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

export const updateAvatar = async (userId: string, fileBuffer: Buffer) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.avatar.includes("res.cloudinary.com")) {
    const publicId = user.avatar.split("/").slice(-1)[0].split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });

  user.avatar = result.secure_url;

  await user.save();

  return user;
};
