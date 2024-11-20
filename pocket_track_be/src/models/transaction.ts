import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  isExpense: boolean;
  user: mongoose.Types.ObjectId;
  transferBeneficiary?: string;
  category?: mongoose.Types.ObjectId;
  tags?: mongoose.Types.ObjectId[];
  description?: string;
  isNecessary?: boolean;
  isTransfer?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    isExpense: { type: Boolean, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transferBeneficiary: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    description: { type: String },
    isNecessary: { type: Boolean },
    isTransfer: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
