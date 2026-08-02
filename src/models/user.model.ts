import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type UserType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserType>;

const User = model<UserType>("User", userSchema);

export default User;
