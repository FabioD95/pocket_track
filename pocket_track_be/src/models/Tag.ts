import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITag extends Document {
  name: string;
  createdBy: Types.ObjectId;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    usageCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITag>("Tag", TagSchema);
