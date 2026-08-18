import prisma from "../config/prisma.js";
import { logActivity } from "./activity.controller.js";

// Create a new invitation for a workspace
export const createInvitation = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if requester is OWNER or ADMIN
    const requesterMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });

    if (!requesterMember || !["OWNER", "ADMIN"].includes(requesterMember.role)) {
      return res.status(403).json({ message: "Only OWNER or ADMIN can invite members" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true, name: true },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if target user is already a member
    const existingMemberUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingMemberUser) {
      const existingMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: existingMemberUser.id } },
      });
      if (existingMember) {
        return res.status(400).json({ message: "User is already a member of this workspace" });
      }
    }

    // Check if there is already a PENDING invitation
    const existingInvite = await prisma.workspaceInvitation.findFirst({
      where: {
        workspaceId,
        inviteeEmail: cleanEmail,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return res.status(400).json({ message: "An invitation is already pending for this email" });
    }

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        workspaceId,
        inviterId: req.user.id,
        inviteeEmail: cleanEmail,
        role: role || "MEMBER",
        status: "PENDING",
      },
      include: {
        workspace: { select: { id: true, name: true } },
        inviter: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // If recipient has an account, send notification & socket alert
    if (existingMemberUser) {
      const notification = await prisma.notification.create({
        data: {
          userId: existingMemberUser.id,
          senderId: req.user.id,
          type: "WORKSPACE_INVITATION",
          title: "Workspace Invitation",
          message: `${req.user.name} invited you to join workspace "${workspace.name}"`,
          metadata: {
            invitationId: invitation.id,
            workspaceId: workspace.id,
            workspaceName: workspace.name,
            role: invitation.role,
          },
        },
        include: {
          sender: { select: { id: true, name: true, email: true, avatar: true } },
        },
      });

      const io = req.app.get("io");
      if (io) {
        io.to(`user:${existingMemberUser.id}`).emit("new_invitation", {
          invitation,
          notification,
        });
      }
    }

    await logActivity(workspaceId, req.user.id, `sent workspace invitation to "${cleanEmail}"`);

    res.status(201).json(invitation);
  } catch (error) {
    console.error("Create Invitation Error:", error);
    res.status(500).json({ message: "Server error creating invitation" });
  }
};

// Get pending invitations for logged-in user
export const getUserInvitations = async (req, res) => {
  try {
    const invitations = await prisma.workspaceInvitation.findMany({
      where: {
        inviteeEmail: req.user.email.toLowerCase(),
        status: "PENDING",
      },
      include: {
        workspace: { select: { id: true, name: true, description: true } },
        inviter: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Get User Invitations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Respond to an invitation (ACCEPT or REJECT)
export const respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { action } = req.body; // "ACCEPT" or "REJECT"

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be ACCEPT or REJECT" });
    }

    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
      include: {
        workspace: { select: { id: true, name: true } },
        inviter: { select: { id: true, name: true, email: true } },
      },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitation.inviteeEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: "You are not authorized to respond to this invitation" });
    }

    if (invitation.status !== "PENDING") {
      return res.status(400).json({ message: `Invitation has already been ${invitation.status.toLowerCase()}` });
    }

    const io = req.app.get("io");

    if (action === "ACCEPT") {
      // Update invitation status
      await prisma.workspaceInvitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      });

      // Add to workspace members
      await prisma.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: invitation.workspaceId,
            userId: req.user.id,
          },
        },
        update: { role: invitation.role },
        create: {
          workspaceId: invitation.workspaceId,
          userId: req.user.id,
          role: invitation.role,
        },
      });

      // Create notification for inviter
      const notification = await prisma.notification.create({
        data: {
          userId: invitation.inviterId,
          senderId: req.user.id,
          type: "INVITATION_ACCEPTED",
          title: "Invitation Accepted",
          message: `${req.user.name} accepted your invitation to join "${invitation.workspace.name}"`,
          metadata: {
            workspaceId: invitation.workspaceId,
            workspaceName: invitation.workspace.name,
            invitationId: invitation.id,
          },
        },
        include: {
          sender: { select: { id: true, name: true, email: true, avatar: true } },
        },
      });

      // Emit socket event to inviter
      if (io) {
        io.to(`user:${invitation.inviterId}`).emit("invitation_accepted", {
          invitationId: invitation.id,
          workspaceName: invitation.workspace.name,
          user: { id: req.user.id, name: req.user.name, email: req.user.email },
          notification,
        });
      }

      await logActivity(invitation.workspaceId, req.user.id, `joined the workspace via invitation`);

      return res.status(200).json({
        message: "Invitation accepted successfully",
        status: "ACCEPTED",
        workspaceId: invitation.workspaceId,
      });
    } else {
      // REJECT action
      await prisma.workspaceInvitation.update({
        where: { id: invitationId },
        data: { status: "REJECTED" },
      });

      // Create notification for inviter
      const notification = await prisma.notification.create({
        data: {
          userId: invitation.inviterId,
          senderId: req.user.id,
          type: "INVITATION_REJECTED",
          title: "Invitation Rejected",
          message: `${req.user.name} (${req.user.email}) rejected your invitation to join "${invitation.workspace.name}"`,
          metadata: {
            workspaceId: invitation.workspaceId,
            workspaceName: invitation.workspace.name,
            invitationId: invitation.id,
          },
        },
        include: {
          sender: { select: { id: true, name: true, email: true, avatar: true } },
        },
      });

      // Emit socket event to inviter
      if (io) {
        io.to(`user:${invitation.inviterId}`).emit("invitation_rejected", {
          invitationId: invitation.id,
          workspaceName: invitation.workspace.name,
          user: { id: req.user.id, name: req.user.name, email: req.user.email },
          notification,
        });
      }

      return res.status(200).json({
        message: "Invitation rejected",
        status: "REJECTED",
      });
    }
  } catch (error) {
    console.error("Respond to Invitation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get invitations for a workspace (Admin view)
export const getWorkspaceInvitations = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const invitations = await prisma.workspaceInvitation.findMany({
      where: { workspaceId },
      include: {
        inviter: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Get Workspace Invitations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel/delete invitation (Admin action)
export const cancelInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;

    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    const requesterMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: invitation.workspaceId,
          userId: req.user.id,
        },
      },
    });

    if (!requesterMember || !["OWNER", "ADMIN"].includes(requesterMember.role)) {
      return res.status(403).json({ message: "Only OWNER or ADMIN can cancel invitations" });
    }

    await prisma.workspaceInvitation.delete({ where: { id: invitationId } });

    res.status(200).json({ message: "Invitation canceled" });
  } catch (error) {
    console.error("Cancel Invitation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
