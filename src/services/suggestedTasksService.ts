import SuggestedTasks from "../models/SuggestedTasks";
import { Types } from "mongoose";

export async function GetSuggestedTasks(tags: string | undefined) {
  let query = {};

  if (tags && typeof tags === "string") {
    const tagIds = tags.split(",");
    query = { tags: { $in: tagIds } };
  }

  return await SuggestedTasks.find(query).populate("tags");
}

export async function CreateSuggestedTask(
  title: string,
  tags: Types.ObjectId[]
) {
  const newTask = new SuggestedTasks({ title, tags });
  const savedTask = await newTask.save();
  return await SuggestedTasks.findById(savedTask._id).populate("tags");
}

export async function UpdateSuggestedTask(_id: string, title: string) {
  return await SuggestedTasks.findByIdAndUpdate(
    _id,
    { title },
    { new: true }
  ).populate("tags");
}
