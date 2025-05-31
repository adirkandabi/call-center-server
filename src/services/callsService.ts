import Call from "../models/Calls";
import Tag from "../models/Tags";
import CallTasks from "../models/CallTasks";
import SuggestedTasks from "../models/SuggestedTasks";

export async function GetCalls() {
  const calls = await Call.find().populate("tags");

  const fullData = await Promise.all(
    calls.map(async (call) => {
      // Populate suggestedTask
      const callTasks = await CallTasks.find({ callId: call._id }).populate(
        "suggestedTask"
      );

      // Build tasks list with title from suggestedTask if needed
      const enrichedTasks = callTasks.map((task) => {
        const taskObj = task.toObject() as any;
        if (taskObj.isSuggested && taskObj.suggestedTask) {
          taskObj.title = (taskObj.suggestedTask as any).title;
          taskObj.suggestedTaskId = (taskObj.suggestedTask as any)._id;
        }

        delete taskObj.suggestedTask;
        return taskObj;
      });

      const tagIds = call.tags.map((tag: any) => tag._id);
      const suggestedTasks = await SuggestedTasks.find(
        {
          tags: { $in: tagIds },
        },
        { tags: 0 }
      );

      return {
        ...call.toObject(),
        callTasks: enrichedTasks,
        suggestedTasks,
      };
    })
  );
  return fullData;
}

export async function CreateCall(title: string) {
  const newCall = new Call({ title });
  return await newCall.save();
}

export async function UpdateCall(title: string, _id: string) {
  return await Call.findByIdAndUpdate(_id, { title }, { new: true }).populate(
    "tags"
  );
}

export async function AssignTag(_id: string, tag_id: string) {
  const tag = await Tag.findById(tag_id);
  if (!tag) {
    return null;
  }

  const updatedCall = await Call.findByIdAndUpdate(
    _id,
    { $addToSet: { tags: tag_id } }, // Avoid duplicates
    { new: true }
  ).populate("tags");

  if (!updatedCall) {
    return null;
  }

  // Fetch callTasks and populate suggestedTask
  const callTasks = await CallTasks.find({
    callId: updatedCall._id,
  }).populate("suggestedTask");

  // Enrich tasks with title and suggestedTaskId
  const enrichedTasks = callTasks.map((task) => {
    const taskObj = task.toObject() as any;

    if (taskObj.isSuggested && taskObj.suggestedTask) {
      taskObj.title = taskObj.suggestedTask.title;
      taskObj.suggestedTaskId = taskObj.suggestedTask._id;
    }

    delete taskObj.suggestedTask;
    return taskObj;
  });

  // Find suggestedTasks by tags
  const tagIds = updatedCall.tags.map((tag: any) => tag._id);
  const suggestedTasks = await SuggestedTasks.find(
    { tags: { $in: tagIds } },
    { tags: 0 }
  );

  return {
    ...updatedCall.toObject(),
    callTasks: enrichedTasks,
    suggestedTasks,
  };
}
