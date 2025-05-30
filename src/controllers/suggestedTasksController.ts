import { Request, Response } from "express";
import SuggestedTasks from "../models/SuggestedTasks";
import { Types } from "mongoose";

// Get all suggested tasks by tag
const Get = async (req: Request, res: Response) => {
  try {
    const { tags } = req.query;

    let query = {};

    if (tags && typeof tags === "string") {
      const tagIds = tags.split(",");
      query = { tags: { $in: tagIds } };
    }

    const tasks = await SuggestedTasks.find(query).populate("tags");
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

      const newTask = new SuggestedTasks({ title: req.body.title, tags });
      const savedTask = await newTask.save();
      const populatedTask = await SuggestedTasks.findById(
        savedTask._id
      ).populate("tags");
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
    let tags: Types.ObjectId[] = [];

    if (req.body.tags) {
      if (!Array.isArray(req.body.tags)) {
        res.status(400).json({ error: "tags must be an array" });
      }
      tags = req.body.tags;
    }
    const updatedTask = await SuggestedTasks.findByIdAndUpdate(
      req.body._id,
      { title: req.body.title, tags },
      { new: true }
    ).populate("tags");

    res.status(200).json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};
// // Assign tag to a call
// const assignTag = async (req: Request, res: Response) => {
//   try {
//     if (!req.body || !req.body._id) {
//       res.status(400).json({ error: "id is required" });
//     }
//     if (!req.body.tag_id) {
//       res.status(400).json({ error: "title is required" });
//     }
//     const tag = await Tag.findById(req.body.tag_id);
//     if (!tag) {
//       res.status(404).json({ error: "Tag not found" });
//     } else {
//       const updatedCall = await Call.findByIdAndUpdate(
//         req.body._id,
//         { $push: { tags: req.body.tag_id } },
//         { new: true }
//       );
//       res.status(200).json({ updatedCall });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err || "Internal server error" });
//   }
// };
export default {
  Create,
  Get,
  Update,
};
