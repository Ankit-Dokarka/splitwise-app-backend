import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  Types,
} from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export type GroupType = InferSchemaType<typeof groupSchema>;
export type GroupDocument = HydratedDocument<GroupType>;

groupSchema.pre("validate", async function (this: GroupDocument) {
  if (this.members.length === 0) {
    throw new Error("A group must have at least one member.");
  }

  const uniqueMembers = new Set(this.members.map((id) => id.toString()));
  this.members = Array.from(uniqueMembers).map((id) => new Types.ObjectId(id));
});

const Group = model<GroupType>("Group", groupSchema);

export default Group;
