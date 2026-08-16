import prisma from "../config/prisma.js";

// ====================== GET ACTIVITIES ======================
export const getActivities = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const activities = await prisma.activity.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Get Activities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOG ACTIVITY (helper) ======================
export const logActivity = async (workspaceId, userId, action) => {
  try {
    await prisma.activity.create({
      data: { action, workspaceId, userId },
    });
  } catch (error) {
    console.error("Log Activity Error:", error);
  }
};
