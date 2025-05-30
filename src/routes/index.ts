import express from "express";
import tagsRoutes from "./tags";
import callsRoutes from "./calls";
import suggestedTasksRoutes from "./suggestedTasks";
import callTasksRoutes from "./calltasks";

const router = express.Router();

router.use("/tags", tagsRoutes);
router.use("/calls", callsRoutes);
router.use("/suggested-tasks", suggestedTasksRoutes);
router.use("/tasks", callTasksRoutes);
export default router;
