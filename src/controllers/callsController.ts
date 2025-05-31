import { Request, Response } from "express";
import Call from "../models/Calls";
import Tag from "../models/Tags";
import CallTasks from "../models/CallTasks";
import SuggestedTasks from "../models/SuggestedTasks";
import {
  GetCalls,
  CreateCall,
  UpdateCall,
  AssignTag,
} from "../services/callsService";

// Get all calls
const Get = async (req: Request, res: Response) => {
  try {
    const fullData = await GetCalls();
    res.status(200).json(fullData);
  } catch (err) {
    console.error("Failed to fetch calls:", err);
    res.status(500).json({ error: "Failed to fetch calls" });
  }
};

// Create new call
const Create = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.title) {
      res.status(400).json({ error: "title is required" });
    }
    const savedCall = await CreateCall(req.body.title);
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
    const updatedCall = await UpdateCall(req.body.title, req.body._id);
    res.status(200).json(updatedCall);
  } catch (err: any) {
    res.status(500).json({ error: err || "Internal server error" });
  }
};
// Assign tag to a call
const assignTag = async (req: Request, res: Response) => {
  try {
    const { _id, tag_id } = req.body;

    if (!_id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    if (!tag_id) {
      res.status(400).json({ error: "tag_id is required" });
      return;
    }
    const response = await AssignTag(_id, tag_id);
    if (!response) {
      res.status(400).json({ error: "Somthing went wrong" });
    }
    res.status(200).json(response);
  } catch (err) {
    console.error("Error in assignTag:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default {
  Create,
  Get,
  Update,
  assignTag,
};
