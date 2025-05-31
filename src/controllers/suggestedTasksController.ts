import { Request, Response } from "express";
import {
  CreateSuggestedTask,
  GetSuggestedTasks,
  UpdateSuggestedTask,
} from "../services/suggestedTasksService";
import { Types } from "mongoose";

// Get all suggested tasks by tag
const Get = async (req: Request, res: Response) => {
  try {
    const { tags } = req.query;
    const tagsStr = typeof tags === "string" ? tags : undefined;
    const tasks = await GetSuggestedTasks(tagsStr);
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};

// Create new suggested task
const Create = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    if (
      !req.body.tags ||
      (Array.isArray(req.body.tags) && req.body.tags.length === 0)
    ) {
      res
        .status(400)
        .json({ error: "suggested task must include at least one tag" });
    } else {
      let tags: Types.ObjectId[] = [];

      if (!Array.isArray(req.body.tags)) {
        res.status(400).json({ error: "tags must be an array" });
      }
      tags = req.body.tags;
      const populatedTask = await CreateSuggestedTask(req.body.title, tags);
      res.status(201).json(populatedTask);
    }
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};
// Update suggested task
const Update = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    if (!req.body._id) {
      res.status(400).json({ error: "id is required" });
    }
    const updatedTask = await UpdateSuggestedTask(req.body._id, req.body.title);
    res.status(200).json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};

export default {
  Create,
  Get,
  Update,
};
