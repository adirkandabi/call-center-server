import { Schema, Types, model } from "mongoose";

const callSchema = new Schema(
  {
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
  },
  { versionKey: false }
);
export default model("Call", callSchema);
