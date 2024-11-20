import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFamily extends Document {
  name: string;
  transactions: Types.ObjectId[];
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FamilySchema = new Schema<IFamily>(
  {
    name: { type: String, required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFamily>("Family", FamilySchema);
