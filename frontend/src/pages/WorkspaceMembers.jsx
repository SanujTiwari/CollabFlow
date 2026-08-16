import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

const roleColors = {
  OWNER: "bg-amber-500/20 text-amber-400",
  ADMIN: "bg-violet-500/20 text-violet-400",
  MEMBER: "bg-blue-500/20 text-blue-400",
  VIEWER: "bg-gray-500/20 text-gray-400",
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
      setSuccess("Member added successfully");
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
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-white mb-1">Members</h2>
      <p className="text-gray-400 mb-8">Manage workspace members and their roles</p>

      {/* Invite */}
      {canManage && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Invite Member</h3>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-3 text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg mb-3 text-sm">{success}</div>
          )}
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
            <button
              type="submit"
              disabled={inviteLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-50"
            >
              {inviteLoading ? "Adding..." : "Add Member"}
            </button>
          </form>
        </div>
      )}

      {/* Member List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {member.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {member.user.name}
                    {member.userId === user?.id && (
                      <span className="text-xs text-gray-500 ml-2">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {canManage && member.role !== "OWNER" ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                ) : (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                )}
                {canManage && member.role !== "OWNER" && member.userId !== user?.id && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                    title="Remove member"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
