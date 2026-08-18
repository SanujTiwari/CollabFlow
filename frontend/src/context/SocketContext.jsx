import { createContext, useContext, useEffect, useState } from "react";
import { io as socketIO } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [notificationsUpdateTrigger, setNotificationsUpdateTrigger] = useState(0);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = socketIO(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinUser", user.id);
    });

    // Listen for new invitations
    newSocket.on("new_invitation", (data) => {
      addToast({
        type: "invitation",
        title: "New Workspace Invitation",
        message: `${data.invitation.inviter.name} invited you to join "${data.invitation.workspace.name}"`,
        invitation: data.invitation,
      });
      setNotificationsUpdateTrigger((prev) => prev + 1);
    });

    // Listen for invitation accepted
    newSocket.on("invitation_accepted", (data) => {
      addToast({
        type: "success",
        title: "Invitation Accepted! 🎉",
        message: `${data.user.name} accepted your invitation to join "${data.workspaceName}"`,
      });
      setNotificationsUpdateTrigger((prev) => prev + 1);
    });

    // Listen for invitation rejected
    newSocket.on("invitation_rejected", (data) => {
      addToast({
        type: "error",
        title: "Invitation Rejected ❌",
        message: `${data.user.name} (${data.user.email}) rejected your invitation to join "${data.workspaceName}"`,
      });
      setNotificationsUpdateTrigger((prev) => prev + 1);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        toasts,
        addToast,
        removeToast,
        notificationsUpdateTrigger,
        refreshNotifications: () => setNotificationsUpdateTrigger((prev) => prev + 1),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
