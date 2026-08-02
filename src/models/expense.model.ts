import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const participantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  share: {
    type: Number,
    required: true,
  },
});

const expenseSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [participantSchema],
    splitType: {
      type: String,
      enum: ["equal", "exact", "percentage"],
      default: "equal",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type ExpenseType = InferSchemaType<typeof expenseSchema>;
export type ExpenseDocument = HydratedDocument<ExpenseType>;

const Expense = model<ExpenseType>("Expense", expenseSchema);

export default Expense;
