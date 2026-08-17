import express from "express";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  getWorkspaceStats,
} from "../controllers/workspace.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/", protect, getWorkspaces);
router.get("/:workspaceId", protect, getWorkspaceById);
router.get("/:workspaceId/stats", protect, getWorkspaceStats);

export default router;
