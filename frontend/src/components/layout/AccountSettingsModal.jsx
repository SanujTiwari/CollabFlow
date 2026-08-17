import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";

const AccountSettingsModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security' | 'preferences'

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = { name, avatar };
      if (newPassword) payload.password = newPassword;

      const { data } = await api.put("/auth/profile", payload);
      updateUser(data);
      setMessage({ type: "success", text: "Profile settings saved successfully!" });
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white border border-[#C9C3BB] rounded-2xl shadow-[0_16px_48px_-8px_rgba(0,0,0,0.15)] w-full max-w-2xl overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] bg-[#F8F6F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D47E30] rounded-2xl flex items-center justify-center shadow-sm text-white font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Account & User Settings</h2>
              <p className="text-xs text-[#94a3b8] font-medium">Manage your personal profile and security preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#1E293B] p-2 rounded-xl hover:bg-[#DFDBD4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#E5E7EB] bg-[#FAFAF8] px-6 gap-2 pt-2">
          {[
            { id: "profile", label: "My Profile", icon: "👤" },
            { id: "security", label: "Security & Password", icon: "🔑" },
            { id: "preferences", label: "Preferences", icon: "🎨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
                activeTab === tab.id
                  ? "bg-white text-[#D47E30] border-[#E5E7EB] -mb-px"
                  : "text-[#94a3b8] border-transparent hover:text-[#1E293B] hover:bg-white/60"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {message && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-50 text-[#22C55E] border-green-200"
                  : "bg-red-50 text-[#DC2626] border-red-200"
              }`}
            >
              <span>{message.type === "success" ? "✓" : "⚠️"}</span>
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-5">
              {/* Avatar Preview & URL */}
              <div className="flex items-center gap-5 p-4 bg-[#F8F6F2] rounded-2xl border border-[#E5E7EB]">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#D47E30]/30 shadow-sm"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#D47E30] rounded-full flex items-center justify-center font-extrabold text-white text-2xl shadow-sm ring-2 ring-[#D47E30]/30">
                      {name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#22C55E] border-2 border-white rounded-full" />
                </div>

                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs"
                  />
                  <p className="text-[10px] text-[#94a3b8]">Paste an image link or leave empty to use initials icon</p>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              {/* Email Address (read only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2 flex items-center justify-between">
                  <span>Account Email</span>
                  <span className="text-[10px] text-[#22C55E] font-semibold">Verified</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-[#F8F6F2] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#94a3b8] cursor-not-allowed opacity-75"
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <p className="text-xs text-[#94a3b8]">
                Change your account password. Leave blank if you do not wish to update your password.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F8F6F2] rounded-2xl border border-[#E5E7EB]">
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Real-Time Activity Notifications</h4>
                  <p className="text-xs text-[#94a3b8]">Receive live alerts when assigned to tasks or mentioned</p>
                </div>
                <div className="w-12 h-6 bg-[#D47E30] rounded-full p-1 flex items-center justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8F6F2] rounded-2xl border border-[#E5E7EB]">
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Default Workspace Theme</h4>
                  <p className="text-xs text-[#94a3b8]">Warm & Professional</p>
                </div>
                <span className="text-xs font-bold text-[#D47E30] bg-[#FEF3E7] px-3 py-1 rounded-full border border-[#D47E30]/20">
                  Active
                </span>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#E5E7EB] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#475569] hover:text-[#1E293B] bg-[#F8F6F2] hover:bg-[#DFDBD4] border border-[#C9C3BB] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold btn-glow rounded-xl flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
