import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  type: "income" | "expense";
  user: string;
  transferBeneficiary?: string;
  category?: mongoose.Types.ObjectId; // Riferimento al modello Categoria
  tags?: mongoose.Types.ObjectId[]; // Array di riferimenti al modello Tag
  description?: string;
  isNecessary?: boolean;
  isTransfer?: boolean;
}

const TransactionSchema: Schema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  user: { type: String, required: true },
  transferBeneficiary: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  description: { type: String },
  isNecessary: { type: Boolean },
  isTransfer: { type: Boolean },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
