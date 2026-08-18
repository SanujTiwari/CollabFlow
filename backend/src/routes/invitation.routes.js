import express from "express";
import {
  createInvitation,
  getUserInvitations,
  respondToInvitation,
  getWorkspaceInvitations,
  cancelInvitation,
} from "../controllers/invitation.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User level invitation routes
router.get("/user", protect, getUserInvitations);
router.post("/:invitationId/respond", protect, respondToInvitation);

// Workspace level invitation routes
router.post("/workspace/:workspaceId", protect, createInvitation);
router.get("/workspace/:workspaceId", protect, getWorkspaceInvitations);
router.delete("/:invitationId", protect, cancelInvitation);

export default router;
