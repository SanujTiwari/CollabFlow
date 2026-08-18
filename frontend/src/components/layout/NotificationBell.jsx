import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { useSocket } from "../../context/SocketContext";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notificationsUpdateTrigger } = useSocket();
  const [open, setOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState(null);
  const bellRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, notifRes] = await Promise.all([
        api.get("/invitations/user"),
        api.get("/notifications"),
      ]);

      setInvitations(invRes.data || []);
      setNotifications(notifRes.data?.notifications || []);
      setUnreadCount((invRes.data?.length || 0) + (notifRes.data?.unreadCount || 0));
    } catch (error) {
      console.error("Failed to fetch notifications/invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [notificationsUpdateTrigger]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRespond = async (invitationId, action) => {
    try {
      setRespondingId(invitationId);
      const { data } = await api.post(`/invitations/${invitationId}/respond`, { action });
      
      // Remove handled invitation
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      if (action === "ACCEPT" && data.workspaceId) {
        setOpen(false);
        navigate(`/workspace/${data.workspaceId}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} invitation:`, error);
      alert(error.response?.data?.message || `Failed to ${action.toLowerCase()} invitation`);
    } finally {
      setRespondingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/all/read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(invitations.length);
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  return (
    <div className="relative z-50" ref={bellRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-full bg-[#F8F6F2] hover:bg-[#EFEBE4] border border-[#C9C3BB] text-[#475569] hover:text-[#1E293B] transition-all cursor-pointer focus:outline-none"
        title="Notifications & Invitations"
      >
        <svg className="w-5 h-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D47E30] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] bg-white border border-[#C9C3BB] rounded-3xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-[#F8F6F2] border-b border-[#C9C3BB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#1E293B]">Notifications & Invitations</h3>
              {unreadCount > 0 && (
                <span className="bg-[#FEF3E7] text-[#D47E30] border border-[#D47E30]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#D47E30] hover:underline"
              >
                Mark read
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-[#E5E7EB]">
            {/* PENDING WORKSPACE INVITATIONS SECTION */}
            {invitations.length > 0 && (
              <div className="p-3 bg-[#FEF9F3]">
                <p className="px-2 py-1 text-[11px] font-extrabold text-[#D47E30] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D47E30] animate-ping inline-block" />
                  Pending Workspace Invitations ({invitations.length})
                </p>

                <div className="space-y-3 mt-2">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3.5 bg-white border border-[#E8DDD0] rounded-2xl shadow-sm space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-[#D47E30] rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                          {inv.inviter?.name?.charAt(0)?.toUpperCase() || "W"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                            <span className="font-bold text-[#1E293B]">{inv.inviter?.name}</span> invited you to join workspace{" "}
                            <span className="font-bold text-[#D47E30]">"{inv.workspace?.name}"</span>
                          </p>
                          <span className="inline-block mt-1 text-[10px] text-[#78716C] bg-[#F8F6F2] px-2 py-0.5 rounded-md font-semibold">
                            Role: {inv.role}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Accept / Approve vs Reject */}
                      <div className="flex items-center gap-2 pt-1 border-t border-[#F3ECE4]">
                        <button
                          onClick={() => handleRespond(inv.id, "ACCEPT")}
                          disabled={respondingId === inv.id}
                          className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespond(inv.id, "REJECT")}
                          disabled={respondingId === inv.id}
                          className="flex-1 bg-white hover:bg-rose-50 text-[#DC2626] border border-rose-200 text-xs font-bold py-1.5 px-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS LIST */}
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 flex items-start gap-3 transition-colors ${
                    notif.isRead ? "bg-white" : "bg-[#FFF9F3]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      notif.type === "INVITATION_ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : notif.type === "INVITATION_REJECTED"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {notif.type === "INVITATION_ACCEPTED"
                      ? "✓"
                      : notif.type === "INVITATION_REJECTED"
                      ? "✕"
                      : "ℹ"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E293B]">{notif.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{notif.message}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-1">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : invitations.length === 0 ? (
              <div className="p-8 text-center text-[#94a3b8]">
                <svg className="w-10 h-10 mx-auto text-[#C9C3BB] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-xs font-semibold">No new notifications</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
