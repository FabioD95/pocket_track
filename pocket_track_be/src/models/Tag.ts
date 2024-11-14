import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const TagSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model<ITag>("Tag", TagSchema);
