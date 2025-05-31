import { Request, Response } from "express";
import Tag from "../models/Tags";
import { CreateTags, GetTags, UpdateTag } from "../services/tagsService";

// Create new tag
const Create = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    const savedTag = await CreateTags(req.body.title);
    if (!savedTag) {
      res.status(400).json({ error: "tag is exist" });
    }
    res.status(201).json(savedTag);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};

// Get all tags
const Get = async (req: Request, res: Response) => {
  try {
    const tags = await GetTags();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Update tag's title
const Update = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    if (!req.body._id) {
      res.status(400).json({ error: "id is required" });
    }
    const updatedTag = await UpdateTag(req.body._id, req.body.title);
    res.status(200).json(updatedTag);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};

export default {
  Create,
  Get,
  Update,
};
