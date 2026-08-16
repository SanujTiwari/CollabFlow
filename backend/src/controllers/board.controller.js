import prisma from "../config/prisma.js";
import { logActivity } from "./activity.controller.js";

// ====================== CREATE BOARD ======================
export const createBoard = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Board title is required" });
    }

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (member.role === "VIEWER") {
      return res.status(403).json({ message: "Viewers cannot create boards" });
    }

    const board = await prisma.board.create({
      data: { title, workspaceId },
      include: {
        _count: { select: { lists: true } },
      },
    });

    await logActivity(workspaceId, req.user.id, `created board "${title}"`);

    res.status(201).json(board);
  } catch (error) {
    console.error("Create Board Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET WORKSPACE BOARDS ======================
export const getBoards = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied" });
    }

    const boards = await prisma.board.findMany({
      where: { workspaceId },
      include: {
        _count: { select: { lists: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(boards);
  } catch (error) {
    console.error("Get Boards Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET BOARD BY ID ======================
export const getBoardById = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            tasks: {
              orderBy: { position: "asc" },
              include: {
                assignees: {
                  include: {
                    user: { select: { id: true, name: true, avatar: true } },
                  },
                },
                _count: { select: { comments: true } },
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: board.workspaceId, userId: req.user.id } },
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(board);
  } catch (error) {
    console.error("Get Board Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== UPDATE BOARD ======================
export const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    const board = await prisma.board.update({
      where: { id: boardId },
      data: { title },
    });

    res.status(200).json(board);
  } catch (error) {
    console.error("Update Board Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== DELETE BOARD ======================
export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (board) {
      await logActivity(board.workspaceId, req.user.id, `deleted board "${board.title}"`);
    }

    await prisma.board.delete({ where: { id: boardId } });

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Delete Board Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
