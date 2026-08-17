import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  reorderTasks,
  addAssignee,
  removeAssignee,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createTask);
router.put("/reorder", protect, reorderTasks);
router.get("/:taskId", protect, getTask);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

// Assignees
router.post("/:taskId/assignees", protect, addAssignee);
router.delete("/:taskId/assignees/:userId", protect, removeAssignee);

// Checklist
router.post("/:taskId/checklist", protect, addChecklistItem);
router.put("/checklist/:itemId", protect, updateChecklistItem);
router.delete("/checklist/:itemId", protect, deleteChecklistItem);

export default router;
