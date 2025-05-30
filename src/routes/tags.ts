import express, { Request, Response } from "express";
import tagsController from "../controllers/tagsController";

const router = express.Router();

router.post("/", tagsController.Create);
router.get("/", tagsController.Get);
router.put("/", tagsController.Update);

export default router;
