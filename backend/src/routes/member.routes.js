import express from "express";
import {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/member.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, addMember);
router.get("/", protect, getMembers);
router.put("/:memberId", protect, updateMemberRole);
router.delete("/:memberId", protect, removeMember);

export default router;
