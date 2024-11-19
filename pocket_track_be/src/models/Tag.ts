import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  createdAt: Date;
}

const TagSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITag>("Tag", TagSchema);
