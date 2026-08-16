import prisma from "../config/prisma.js";

// ====================== CREATE TASK ======================
export const createTask = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const lastTask = await prisma.task.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        position,
        listId,
        createdById: req.user.id,
      },
      include: {
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });

    // Get list to find boardId for socket
    const list = await prisma.list.findUnique({ where: { id: listId } });
    const io = req.app.get("io");
    if (io && list) io.to(`board:${list.boardId}`).emit("task:created", task);

    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== UPDATE TASK ======================
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        list: true,
        _count: { select: { comments: true } },
      },
    });

    const io = req.app.get("io");
    if (io) io.to(`board:${task.list.boardId}`).emit("task:updated", task);

    res.status(200).json(task);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== DELETE TASK ======================
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({ where: { id: taskId } });

    const io = req.app.get("io");
    if (io) io.to(`board:${task.list.boardId}`).emit("task:deleted", { taskId, listId: task.listId });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET TASK ======================
export const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        createdBy: { select: { id: true, name: true, avatar: true } },
        list: { select: { id: true, title: true, boardId: true } },
        _count: { select: { comments: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Get Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== REORDER / MOVE TASKS ======================
export const reorderTasks = async (req, res) => {
  try {
    const { taskId, sourceListId, destinationListId, newPosition } = req.body;

    // Move task to new list and position
    await prisma.task.update({
      where: { id: taskId },
      data: {
        listId: destinationListId,
        position: newPosition,
      },
    });

    // Reorder tasks in destination list
    const tasksInDestination = await prisma.task.findMany({
      where: { listId: destinationListId, id: { not: taskId } },
      orderBy: { position: "asc" },
    });

    // Rebuild positions
    const updates = [];
    let pos = 0;
    for (const t of tasksInDestination) {
      if (pos === newPosition) pos++;
      updates.push(prisma.task.update({ where: { id: t.id }, data: { position: pos } }));
      pos++;
    }
    await Promise.all(updates);

    // If cross-list move, also reorder source list
    if (sourceListId !== destinationListId) {
      const tasksInSource = await prisma.task.findMany({
        where: { listId: sourceListId },
        orderBy: { position: "asc" },
      });
      const sourceUpdates = tasksInSource.map((t, i) =>
        prisma.task.update({ where: { id: t.id }, data: { position: i } })
      );
      await Promise.all(sourceUpdates);
    }

    // Get the source list to find boardId
    const sourceList = await prisma.list.findUnique({ where: { id: sourceListId } });
    const io = req.app.get("io");
    if (io && sourceList) {
      io.to(`board:${sourceList.boardId}`).emit("task:moved", {
        taskId,
        sourceListId,
        destinationListId,
        newPosition,
      });
    }

    res.status(200).json({ message: "Task reordered successfully" });
  } catch (error) {
    console.error("Reorder Tasks Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
