import express from "express";
import callTasksController from "../controllers/callTasksController";

const router = express.Router();

router.post("/", callTasksController.Create);
router.get("/:callId", callTasksController.Get);
router.patch("/:taskId/status", callTasksController.UpdateStatus);

// router.put("/", callTasksController.Update);
// router.patch("/assign-tag", callTasksController.assignTag);
export default router;
