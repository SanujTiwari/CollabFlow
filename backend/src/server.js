import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import memberRoutes from "./routes/member.routes.js";
import { workspaceBoardRouter, boardRouter } from "./routes/board.routes.js";
import listRoutes from "./routes/list.routes.js";
import taskRoutes from "./routes/task.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

app.use(cors());
app.use(express.json());

// =============== ROUTES ===============
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces/:workspaceId/members", memberRoutes);
app.use("/api/workspaces/:workspaceId/boards", workspaceBoardRouter);
app.use("/api/boards", boardRouter);
app.use("/api/boards/:boardId/lists", listRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/lists/:listId/tasks", taskRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks/:taskId/comments", commentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/workspaces/:workspaceId/activities", activityRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("CollabFlow API is running...");
});

// =============== SOCKET.IO ===============
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinUser", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined user:${userId}`);
    }
  });

  socket.on("joinBoard", (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`Socket ${socket.id} joined board:${boardId}`);
  });

  socket.on("leaveBoard", (boardId) => {
    socket.leave(`board:${boardId}`);
    console.log(`Socket ${socket.id} left board:${boardId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});