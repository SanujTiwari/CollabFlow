import prisma from "../config/prisma.js";

// ====================== CREATE WORKSPACE ======================
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Create Workspace Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET USER WORKSPACES ======================
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: req.user.id },
        },
      },
      include: {
        _count: { select: { members: true, boards: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Get Workspaces Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET WORKSPACE BY ID ======================
export const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        _count: { select: { members: true, boards: true } },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is a member
    const isMember = workspace.members.some(
      (m) => m.userId === req.user.id
    );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Get Workspace Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET WORKSPACE STATS ======================
export const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        boards: {
          include: {
            lists: {
              include: {
                tasks: {
                  include: {
                    assignees: {
                      include: {
                        user: { select: { id: true, name: true, avatar: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        activities: {
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const allTasks = workspace.boards.flatMap((b) =>
      b.lists.flatMap((l) => l.tasks.map((t) => ({ ...t, listTitle: l.title })))
    );

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) =>
      ["done", "completed", "finished"].includes(t.listTitle.toLowerCase().trim())
    ).length;

    const priorityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
    allTasks.forEach((t) => {
      if (priorityCounts[t.priority] !== undefined) {
        priorityCounts[t.priority]++;
      }
    });

    const memberWorkloadMap = {};
    workspace.members.forEach((m) => {
      memberWorkloadMap[m.userId] = {
        user: m.user,
        role: m.role,
        taskCount: 0,
      };
    });

    allTasks.forEach((t) => {
      t.assignees.forEach((a) => {
        if (memberWorkloadMap[a.userId]) {
          memberWorkloadMap[a.userId].taskCount++;
        }
      });
    });

    res.status(200).json({
      totalBoards: workspace.boards.length,
      totalTasks,
      completedTasks,
      totalMembers: workspace.members.length,
      priorityCounts,
      memberWorkload: Object.values(memberWorkloadMap),
      recentActivities: workspace.activities,
    });
  } catch (error) {
    console.error("Get Workspace Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

