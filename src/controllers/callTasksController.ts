import { Request, Response } from "express";
import Call from "../models/Calls";
import CallTasks from "../models/CallTasks";
import SuggestedTasks from "../models/SuggestedTasks";
import { Types } from "mongoose";

const Get = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;

    if (!callId) {
      res.status(400).json({ error: "callId is required in the URL" });
    }

    const tasks = await CallTasks.find({ callId: callId }).populate(
      "suggestedTask"
    );

    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};
const Create = async (req: Request, res: Response) => {
  try {
    const { title, suggested_id, call_id } = req.body;

    // Validate call_id
    if (!call_id) {
      res.status(400).json({ error: "call_id is required" });
    }

    // Check call exists
    const call = await Call.findById(call_id);
    if (!call) {
      res.status(404).json({ error: "Call not found" });
    }

    // If suggested_id is provided, validate it
    let isSuggested = false;
    let suggestedId: Types.ObjectId | undefined;

    if (suggested_id) {
      const suggestedTask = await SuggestedTasks.findById(suggested_id);
      if (!suggestedTask) {
        res.status(404).json({ error: "Suggested task not found" });
      }
      isSuggested = true;
      suggestedId = suggestedTask?._id;
    } else if (!title) {
      // If not suggested and no title, it's invalid
      res.status(400).json({ error: "title is required for custom tasks" });
    }

    const newTask = new CallTasks({
      title: title || undefined,
      callId: call_id,
      isSuggested,
      suggestedTask: suggestedId,
    });

    const savedTask = await newTask.save();
    const response = await CallTasks.findById(savedTask._id).populate(
      "suggestedTask"
    );
    res.status(201).json(response);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};
const UpdateStatus = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId) {
      res.status(400).json({ error: "taskId is required in the URL" });
    }

    if (!status || !["Open", "In Progress", "Completed"].includes(status)) {
      res.status(400).json({ error: "Invalid or missing status value" });
    }

    const updatedTask = await CallTasks.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    ).populate("suggestedTask");

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
export default {
  Create,
  Get,
  UpdateStatus,
};
