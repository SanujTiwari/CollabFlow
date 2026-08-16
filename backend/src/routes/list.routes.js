import express from "express";
import { createList, updateList, deleteList } from "../controllers/list.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createList);
router.put("/:listId", protect, updateList);
router.delete("/:listId", protect, deleteList);

export default router;
