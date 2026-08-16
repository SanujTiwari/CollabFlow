import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  reorderTasks,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createTask);
router.put("/reorder", protect, reorderTasks);
router.get("/:taskId", protect, getTask);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

export default router;
