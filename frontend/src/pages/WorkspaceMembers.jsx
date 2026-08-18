import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

const roleColors = {
  OWNER: "bg-amber-50 text-amber-700 border-amber-200",
  ADMIN: "bg-orange-50 text-orange-700 border-orange-200",
  MEMBER: "bg-blue-50 text-blue-700 border-blue-200",
  VIEWER: "bg-gray-50 text-gray-600 border-gray-200",
};

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  ACCEPTED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-300",
};

const WorkspaceMembers = () => {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [membersRes, invitesRes] = await Promise.all([
        api.get(`/workspaces/${workspaceId}/members`),
        api.get(`/invitations/workspace/${workspaceId}`).catch(() => ({ data: [] })),
      ]);
      setMembers(membersRes.data || []);
      setInvitations(invitesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch members or invitations:", error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentUserRole = members.find((m) => m.userId === user?.id)?.role;
  const canManage = ["OWNER", "ADMIN"].includes(currentUserRole);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setInviteLoading(true);
    try {
      const { data } = await api.post(`/invitations/workspace/${workspaceId}`, { email, role });
      setInvitations((prev) => [data, ...prev]);
      setEmail("");
      setSuccess(`Invitation sent successfully to ${email}! Notification delivered.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const { data } = await api.put(`/workspaces/${workspaceId}/members/${memberId}`, { role: newRole });
      setMembers((prev) => prev.map((m) => (m.id === memberId ? data : m)));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleCancelInvite = async (invitationId) => {
    try {
      await api.delete(`/invitations/${invitationId}`);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (err) {
      console.error("Failed to cancel invitation:", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto max-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Workspace Members</h1>
        <p className="text-sm text-[#94a3b8] mt-1">Manage team access and send workspace invitations via Gmail/email</p>
      </div>

      {/* Invite Member Form Box */}
      {canManage && (
        <div className="bg-[#F8F6F2] rounded-2xl p-6 mb-8 border border-[#C9C3BB] shadow-sm">
          <h2 className="text-sm font-extrabold text-[#1E293B] mb-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Send Workspace Invitation
          </h2>
          <p className="text-xs text-[#78716C] mb-4">
            Enter user email/Gmail. The invitee will receive a real-time notification with Accept / Reject options.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-[#DC2626] p-3 rounded-xl mb-3 text-xs font-medium">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-[#22C55E] p-3 rounded-xl mb-3 text-xs font-medium">{success}</div>
          )}

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@gmail.com"
              className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-white border border-[#C9C3BB] rounded-xl px-3 py-2.5 text-xs text-[#1E293B] font-bold focus:outline-none focus:ring-2 focus:ring-[#D47E30]"
            >
              <option value="MEMBER">Role: MEMBER</option>
              <option value="ADMIN">Role: ADMIN</option>
              <option value="VIEWER">Role: VIEWER</option>
            </select>
            <button
              type="submit"
              disabled={inviteLoading}
              className="btn-glow px-6 py-2.5 text-xs font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {inviteLoading ? "Sending Invite..." : "Send Invitation"}
            </button>
          </form>
        </div>
      )}

      {/* Active Members Section */}
      <div className="mb-10">
        <h2 className="text-base font-extrabold text-[#1E293B] mb-3 flex items-center justify-between">
          <span>Active Members ({members.length})</span>
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-4 flex items-center justify-between hover:border-[#D47E30] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {member.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                      {member.user?.name}
                      {member.userId === user?.id && (
                        <span className="text-[10px] bg-[#FEF3E7] text-[#D47E30] border border-[#D47E30]/20 px-2 py-0.5 rounded-full font-bold">YOU</span>
                      )}
                    </p>
                    <p className="text-xs text-[#94a3b8]">{member.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {canManage && member.role !== "OWNER" ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="bg-white border border-[#C9C3BB] rounded-xl px-3 py-1.5 text-xs text-[#1E293B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D47E30]"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  )}

                  {canManage && member.role !== "OWNER" && member.userId !== user?.id && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-[#94a3b8] hover:text-[#DC2626] p-2 rounded-xl hover:bg-red-50 transition-colors"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invitations History / Pending Invitations Section */}
      {invitations.length > 0 && (
        <div>
          <h2 className="text-base font-extrabold text-[#1E293B] mb-3 flex items-center justify-between">
            <span>Sent Workspace Invitations ({invitations.length})</span>
          </h2>

          <div className="space-y-3">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[#64748B] text-xs">
                    ✉️
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">{inv.inviteeEmail}</p>
                    <p className="text-xs text-[#94a3b8]">
                      Invited by {inv.inviter?.name || "Admin"} • Role: {inv.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${statusColors[inv.status] || "bg-gray-100 text-gray-700"}`}>
                    {inv.status}
                  </span>

                  {canManage && inv.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelInvite(inv.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceMembers;
