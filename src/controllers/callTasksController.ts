import { Request, Response } from "express";
import {
  CreateCallTask,
  GetCallTasks,
  UpdateTaskStatus,
} from "../services/callTasksService";

// Get Tasks
const Get = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;

    if (!callId) {
      res.status(400).json({ error: "callId is required in the URL" });
    }
    const tasks = await GetCallTasks(callId);
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};
// Create Task
const Create = async (req: Request, res: Response) => {
  try {
    const { title, suggested_id, call_id } = req.body;

    // Validate call_id
    if (!call_id) {
      res.status(400).json({ error: "call_id is required" });
      return;
    }
    const savedTask = await CreateCallTask(call_id, suggested_id, title);
    if (!savedTask) {
      res.status(400).json({ error: "Bad request" });
    } else {
      res.status(201).json(savedTask);
    }
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};
// Update Task Status
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
    const updatedTask = UpdateTaskStatus(taskId, status);
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
