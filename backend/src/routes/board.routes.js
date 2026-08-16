import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const workspaceBoardRouter = express.Router({ mergeParams: true });
workspaceBoardRouter.post("/", protect, createBoard);
workspaceBoardRouter.get("/", protect, getBoards);

export const boardRouter = express.Router({ mergeParams: true });
boardRouter.get("/:boardId", protect, getBoardById);
boardRouter.put("/:boardId", protect, updateBoard);
boardRouter.delete("/:boardId", protect, deleteBoard);
