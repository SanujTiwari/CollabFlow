import prisma from "../config/prisma.js";
import { logActivity } from "./activity.controller.js";

// ====================== CREATE TASK ======================
export const createTask = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description, priority, dueDate, labels } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });

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
        labels: labels || [],
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
        checklist: true,
        _count: { select: { comments: true } },
      },
    });

    if (list?.board) {
      await logActivity(list.board.workspaceId, req.user.id, `created task "${title}" in "${list.title}"`);
    }

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
    const { title, description, priority, dueDate, labels } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (labels !== undefined) updateData.labels = labels;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        checklist: true,
        list: { include: { board: true } },
        _count: { select: { comments: true } },
      },
    });

    if (task.list?.board) {
      await logActivity(task.list.board.workspaceId, req.user.id, `updated task "${task.title}"`);
    }

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
      include: { list: { include: { board: true } } },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list?.board) {
      await logActivity(task.list.board.workspaceId, req.user.id, `deleted task "${task.title}"`);
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
        checklist: {
          orderBy: { createdAt: "asc" },
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

    const taskToMove = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: { include: { board: true } } },
    });

    const destList = await prisma.list.findUnique({ where: { id: destinationListId } });

    await prisma.task.update({
      where: { id: taskId },
      data: {
        listId: destinationListId,
        position: newPosition,
      },
    });

    const tasksInDestination = await prisma.task.findMany({
      where: { listId: destinationListId, id: { not: taskId } },
      orderBy: { position: "asc" },
    });

    const updates = [];
    let pos = 0;
    for (const t of tasksInDestination) {
      if (pos === newPosition) pos++;
      updates.push(prisma.task.update({ where: { id: t.id }, data: { position: pos } }));
      pos++;
    }
    await Promise.all(updates);

    if (sourceListId !== destinationListId) {
      const tasksInSource = await prisma.task.findMany({
        where: { listId: sourceListId },
        orderBy: { position: "asc" },
      });
      const sourceUpdates = tasksInSource.map((t, i) =>
        prisma.task.update({ where: { id: t.id }, data: { position: i } })
      );
      await Promise.all(sourceUpdates);

      if (taskToMove?.list?.board && destList) {
        await logActivity(
          taskToMove.list.board.workspaceId,
          req.user.id,
          `moved task "${taskToMove.title}" to "${destList.title}"`
        );
      }
    }

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

// ====================== TASK ASSIGNEES ======================
export const addAssignee = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existing = await prisma.taskAssignee.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });

    if (existing) {
      return res.status(400).json({ message: "User is already assigned" });
    }

    const assignee = await prisma.taskAssignee.create({
      data: { taskId, userId },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: { include: { board: true } } },
    });

    if (task?.list?.board) {
      await logActivity(task.list.board.workspaceId, req.user.id, `assigned ${assignee.user.name} to "${task.title}"`);
    }

    const io = req.app.get("io");
    if (io && task) io.to(`board:${task.list.boardId}`).emit("task:assignee_added", { taskId, assignee });

    res.status(201).json(assignee);
  } catch (error) {
    console.error("Add Assignee Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeAssignee = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    await prisma.taskAssignee.delete({
      where: { taskId_userId: { taskId, userId } },
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: { include: { board: true } } },
    });

    const io = req.app.get("io");
    if (io && task) io.to(`board:${task.list.boardId}`).emit("task:assignee_removed", { taskId, userId });

    res.status(200).json({ message: "Assignee removed successfully" });
  } catch (error) {
    console.error("Remove Assignee Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== CHECKLIST ITEMS ======================
export const addChecklistItem = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const item = await prisma.checklistItem.create({
      data: { title, taskId },
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: { include: { board: true } } },
    });

    const io = req.app.get("io");
    if (io && task) io.to(`board:${task.list.boardId}`).emit("task:checklist_updated", { taskId, item });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add Checklist Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateChecklistItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { isCompleted, title } = req.body;

    const data = {};
    if (isCompleted !== undefined) data.isCompleted = isCompleted;
    if (title !== undefined) data.title = title;

    const item = await prisma.checklistItem.update({
      where: { id: itemId },
      data,
    });

    const task = await prisma.task.findUnique({
      where: { id: item.taskId },
      include: { list: { include: { board: true } } },
    });

    const io = req.app.get("io");
    if (io && task) io.to(`board:${task.list.boardId}`).emit("task:checklist_updated", { taskId: item.taskId, item });

    res.status(200).json(item);
  } catch (error) {
    console.error("Update Checklist Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChecklistItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.checklistItem.delete({
      where: { id: itemId },
    });

    const task = await prisma.task.findUnique({
      where: { id: item.taskId },
      include: { list: { include: { board: true } } },
    });

    const io = req.app.get("io");
    if (io && task) io.to(`board:${task.list.boardId}`).emit("task:checklist_deleted", { taskId: item.taskId, itemId });

    res.status(200).json({ message: "Checklist item deleted" });
  } catch (error) {
    console.error("Delete Checklist Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
