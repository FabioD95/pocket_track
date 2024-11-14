import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  type: "income" | "expense";
  executedBy: string;
  beneficiary?: string;
  category: string;
  tags?: string[];
  description?: string;
  isNecessary: boolean;
}

const TransactionSchema: Schema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  executedBy: { type: String, required: true },
  beneficiary: { type: String },
  category: { type: String, required: true },
  tags: { type: [String] },
  description: { type: String },
  isNecessary: { type: Boolean, required: true },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
