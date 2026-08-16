import prisma from "../config/prisma.js";
import { logActivity } from "./activity.controller.js";

// ====================== CREATE LIST ======================
export const createList = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "List title is required" });
    }

    const board = await prisma.board.findUnique({ where: { id: boardId } });

    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });

    const position = lastList ? lastList.position + 1 : 0;

    const list = await prisma.list.create({
      data: { title, boardId, position },
      include: { tasks: true },
    });

    if (board) {
      await logActivity(board.workspaceId, req.user.id, `added list "${title}" to "${board.title}"`);
    }

    // Emit socket event
    const io = req.app.get("io");
    if (io) io.to(`board:${boardId}`).emit("list:created", list);

    res.status(201).json(list);
  } catch (error) {
    console.error("Create List Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== UPDATE LIST ======================
export const updateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    const list = await prisma.list.update({
      where: { id: listId },
      data: { title },
    });

    const io = req.app.get("io");
    if (io) io.to(`board:${list.boardId}`).emit("list:updated", list);

    res.status(200).json(list);
  } catch (error) {
    console.error("Update List Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== DELETE LIST ======================
export const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;

    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.board) {
      await logActivity(list.board.workspaceId, req.user.id, `deleted list "${list.title}"`);
    }

    await prisma.list.delete({ where: { id: listId } });

    const io = req.app.get("io");
    if (io) io.to(`board:${list.boardId}`).emit("list:deleted", { listId, boardId: list.boardId });

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Delete List Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
