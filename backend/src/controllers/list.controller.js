import prisma from "../config/prisma.js";

// ====================== CREATE LIST ======================
export const createList = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "List title is required" });
    }

    // Get the highest position
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });

    const position = lastList ? lastList.position + 1 : 0;

    const list = await prisma.list.create({
      data: { title, boardId, position },
      include: { tasks: true },
    });

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

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list) {
      return res.status(404).json({ message: "List not found" });
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
