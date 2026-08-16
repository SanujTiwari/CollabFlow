import prisma from "../config/prisma.js";

// ====================== ADD COMMENT ======================
export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId: req.user.id,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Emit socket event
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true },
    });
    const io = req.app.get("io");
    if (io && task) {
      io.to(`board:${task.list.boardId}`).emit("comment:created", comment);
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET COMMENTS ======================
export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== DELETE COMMENT ======================
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
