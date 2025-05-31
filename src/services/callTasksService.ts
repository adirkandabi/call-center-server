import Call from "../models/Calls";
import CallTasks from "../models/CallTasks";
import SuggestedTasks from "../models/SuggestedTasks";
import { Types } from "mongoose";

export async function GetCallTasks(callId: string) {
  return await CallTasks.find({ callId: callId }).populate("suggestedTask");
}

export async function CreateCallTask(
  call_id: string,
  suggested_id: string,
  title: string
) {
  // Check call exists
  const call = await Call.findById(call_id);
  if (!call) {
    return null;
  }

  // If suggested_id is provided, validate it
  let isSuggested = false;
  let suggestedId: Types.ObjectId | undefined;
  let suggestedTitle: string | undefined;
  if (suggested_id) {
    const suggestedTask = await SuggestedTasks.findById(suggested_id);
    if (!suggestedTask || typeof suggestedTask.title !== "string") {
      return null;
    }
    isSuggested = true;
    suggestedId = suggestedTask?._id;
    suggestedTitle = suggestedTask?.title;
  } else if (!title) {
    // If not suggested and no title, it's invalid
    return null;
  }

  const newTask = new CallTasks({
    title: title || undefined,
    callId: call_id,
    isSuggested,
    suggestedTask: suggestedId,
  });

  const savedTask = await newTask.save();
  return {
    ...savedTask.toObject(),
    title: savedTask.title || suggestedTitle,
  };
}
export async function UpdateTaskStatus(taskId: string, status: string) {
  return await CallTasks.findByIdAndUpdate(
    taskId,
    { status },
    { new: true }
  ).populate("suggestedTask");
}
