import express from "express";
import callsController from "../controllers/callsController";

const router = express.Router();

router.post("/", callsController.Create);
router.get("/", callsController.Get);
router.put("/", callsController.Update);
router.patch("/assign-tag", callsController.assignTag);
export default router;
