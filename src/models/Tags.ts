import { Schema, model } from "mongoose";

const tagSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { versionKey: false }
);
export default model("Tag", tagSchema);
