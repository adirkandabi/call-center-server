import express from "express";
import suggestedTasksController from "../controllers/suggestedTasksController";

const router = express.Router();

router.post("/", suggestedTasksController.Create);
router.get("/", suggestedTasksController.Get);
router.put("/", suggestedTasksController.Update);
export default router;
