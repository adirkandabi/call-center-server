import { Schema, Types, model } from "mongoose";

const suggestedTaskSchema = new Schema(
  {
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag", required: true }],
  },
  { collection: "suggested_tasks", versionKey: false }
);

export default model("SuggestedTask", suggestedTaskSchema);
