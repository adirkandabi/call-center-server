import { Schema, Types, model } from "mongoose";

const callTaskSchema = new Schema(
  {
    title: { type: String },
    callId: { type: Types.ObjectId, ref: "Call", required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },
    isSuggested: { type: Boolean, default: false },
    suggestedTask: { type: Types.ObjectId, ref: "SuggestedTask" },
  },
  { versionKey: false, collection: "call_tasks" }
);

export default model("CallTask", callTaskSchema);
