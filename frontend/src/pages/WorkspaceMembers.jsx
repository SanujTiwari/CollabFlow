import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

const roleColors = {
  OWNER: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  ADMIN: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  MEMBER: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  VIEWER: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

const WorkspaceMembers = () => {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMembers = async () => {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/members`);
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const currentUserRole = members.find((m) => m.userId === user?.id)?.role;
  const canManage = ["OWNER", "ADMIN"].includes(currentUserRole);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setInviteLoading(true);
    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/members`, { email });
      setMembers((prev) => [...prev, data]);
      setEmail("");
      setSuccess("Member added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
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

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto max-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Workspace Members</h1>
        <p className="text-sm text-gray-400 mt-1">Manage team access and permissions for this workspace</p>
      </div>

      {/* Invite Member Box */}
      {canManage && (
        <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/10 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-3">Invite Team Member</h2>
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-xl mb-3 text-xs font-medium">{error}</div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-xl mb-3 text-xs font-medium">{success}</div>
          )}
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={inviteLoading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-violet-500/20 disabled:opacity-50"
            >
              {inviteLoading ? "Sending..." : "Add Member"}
            </button>
          </form>
        </div>
      )}

      {/* Member List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-violet-500/30 transition-all shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    {member.user.name}
                    {member.userId === user?.id && (
                      <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">YOU</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {canManage && member.role !== "OWNER" ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-200 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="ADMIN" className="bg-gray-900">ADMIN</option>
                    <option value="MEMBER" className="bg-gray-900">MEMBER</option>
                    <option value="VIEWER" className="bg-gray-900">VIEWER</option>
                  </select>
                ) : (
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                )}

                {canManage && member.role !== "OWNER" && member.userId !== user?.id && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="text-gray-400 hover:text-rose-400 p-2 rounded-xl hover:bg-white/5 transition-colors"
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
  );
};

export default WorkspaceMembers;
