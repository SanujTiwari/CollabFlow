import prisma from "../config/prisma.js";

// ====================== ADD MEMBER ======================
export const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check requester's role
    const requesterMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });

    if (!requesterMember || !["OWNER", "ADMIN"].includes(requesterMember.role)) {
      return res.status(403).json({ message: "Only OWNER or ADMIN can add members" });
    }

    // Find user by email
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Check if already a member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: userToAdd.id } },
    });
    if (existingMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: userToAdd.id,
        role: role || "MEMBER",
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    res.status(201).json(member);
  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET MEMBERS ======================
export const getMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { joinedAt: "asc" },
    });

    res.status(200).json(members);
  } catch (error) {
    console.error("Get Members Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== UPDATE MEMBER ROLE ======================
export const updateMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    if (!["ADMIN", "MEMBER", "VIEWER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const requesterMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });

    if (!requesterMember || !["OWNER", "ADMIN"].includes(requesterMember.role)) {
      return res.status(403).json({ message: "Only OWNER or ADMIN can change roles" });
    }

    const member = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    res.status(200).json(member);
  } catch (error) {
    console.error("Update Member Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== REMOVE MEMBER ======================
export const removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const requesterMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });

    if (!requesterMember || !["OWNER", "ADMIN"].includes(requesterMember.role)) {
      return res.status(403).json({ message: "Only OWNER or ADMIN can remove members" });
    }

    const memberToRemove = await prisma.workspaceMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (memberToRemove.role === "OWNER") {
      return res.status(403).json({ message: "Cannot remove the workspace owner" });
    }

    await prisma.workspaceMember.delete({ where: { id: memberId } });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove Member Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
