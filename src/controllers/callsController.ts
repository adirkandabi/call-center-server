import { Request, Response } from "express";
import Call from "../models/Calls";
import Tag from "../models/Tags";

// Get all calls
const Get = async (req: Request, res: Response) => {
  try {
    const calls = await Call.find().populate("tags");
    res.status(200).json(calls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Create new call
const Create = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    const newCall = new Call({ title: req.body.title });
    const savedCall = await newCall.save();
    res.status(201).json(savedCall);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};
// Update call's title
const Update = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    if (!req.body._id) {
      res.status(400).json({ error: "id is required" });
    }
    const updatedCall = await Call.findByIdAndUpdate(
      req.body._id,
      { title: req.body.title },
      { new: true }
    ).populate("tags");

    res.status(200).json(updatedCall);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};
// Assign tag to a call
const assignTag = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body._id) {
      res.status(400).json({ error: "id is required" });
    }
    if (!req.body.tag_id) {
      res.status(400).json({ error: "title is required" });
    }
    const tag = await Tag.findById(req.body.tag_id);
    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
    } else {
      const updatedCall = await Call.findByIdAndUpdate(
        req.body._id,
        { $push: { tags: req.body.tag_id } },
        { new: true }
      ).populate("tags");
      res.status(200).json(updatedCall);
    }
  } catch (err) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};
export default {
  Create,
  Get,
  Update,
  assignTag,
};
