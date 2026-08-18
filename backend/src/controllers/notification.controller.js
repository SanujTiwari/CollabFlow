import prisma from "../config/prisma.js";

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      include: {
        sender: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark notification as read (or mark all as read)
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (notificationId === "all") {
      await prisma.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
      });
      return res.status(200).json({ message: "All notifications marked as read" });
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
