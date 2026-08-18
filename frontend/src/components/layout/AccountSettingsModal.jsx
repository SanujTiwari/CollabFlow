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

      {/* Modal Card - Matched to Screenshot Design */}
      <div className="relative bg-white border border-[#F3ECE4] rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] w-full max-w-2xl overflow-hidden z-10 animate-fade-in">
        
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-[#F3ECE4] bg-[#FFF8F2] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D47E30]/20 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-[#D47E30] rounded-full flex items-center justify-center text-white text-xl font-extrabold shadow-sm">
                {name?.charAt(0)?.toUpperCase() || "S"}
              </div>
            )}
            <div>
              <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Account & User Settings</h2>
              <p className="text-xs text-[#78716C] font-normal mt-0.5">Manage your personal profile and security preferences</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-[#A8A29E] hover:text-[#1E293B] p-2 rounded-xl hover:bg-[#FEF3E7] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Underline Tabs */}
        <div className="flex border-b border-[#F3ECE4] px-6 gap-8 pt-3 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-xs transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "profile"
                ? "border-[#D47E30] text-[#D47E30] font-bold -mb-px"
                : "border-transparent text-[#78716C] hover:text-[#1E293B] font-medium"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>My Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`pb-3 text-xs transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "security"
                ? "border-[#D47E30] text-[#D47E30] font-bold -mb-px"
                : "border-transparent text-[#78716C] hover:text-[#1E293B] font-medium"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`pb-3 text-xs transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "preferences"
                ? "border-[#D47E30] text-[#D47E30] font-bold -mb-px"
                : "border-transparent text-[#78716C] hover:text-[#1E293B] font-medium"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Preferences</span>
          </button>
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
            <div className="space-y-6">
              
              {/* Profile Photo Section */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#D47E30]/20 shadow-sm"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#D47E30] rounded-full flex items-center justify-center font-extrabold text-white text-2xl shadow-sm">
                      {name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  )}
                  {/* Edit Pencil Icon Badge */}
                  <div className="w-6 h-6 bg-white border border-[#C9C3BB] rounded-full text-[#78716C] flex items-center justify-center absolute -bottom-1 -right-1 shadow-sm">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-bold text-[#1E293B]">
                    Profile Photo
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-[#FFFBF7] border border-[#F3ECE4] rounded-2xl pl-4 pr-24 py-2.5 text-xs text-[#78716C] focus:outline-none focus:border-[#D47E30] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => alert("Image URL applied")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1 text-xs font-bold text-[#D47E30] bg-white border border-[#FDE3CE] rounded-xl hover:bg-[#FEF3E7] transition-all cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-[11px] text-[#A8A29E] mt-1">
                    Paste an image link or leave empty to use initials avatar.
                  </p>
                </div>
              </div>

              {/* Full Display Name */}
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-2">
                  Full Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#FFFBF7] border border-[#F3ECE4] rounded-2xl px-4 py-3 text-sm text-[#1E293B] font-semibold focus:outline-none focus:border-[#D47E30] transition-colors pr-10"
                  />
                  <svg className="w-4 h-4 text-[#A8A29E] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Account Email */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#1E293B]">
                    Account Email
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22C55E] bg-[#EFFBF2] border border-[#C6F6D5] px-2.5 py-0.5 rounded-lg">
                    <svg className="w-3 h-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || "sanujvirat@gmail.com"}
                    disabled
                    className="w-full bg-[#F9F7F5] border border-[#F3ECE4] rounded-2xl px-4 py-3 text-sm text-[#78716C] cursor-not-allowed opacity-85 pr-10"
                  />
                  <svg className="w-4 h-4 text-[#A8A29E] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <p className="text-xs text-[#78716C]">
                Change your account password. Leave blank if you do not wish to update your password.
              </p>
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                  className="w-full bg-[#FFFBF7] border border-[#F3ECE4] rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none focus:border-[#D47E30]"
                />
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FFFBF7] rounded-2xl border border-[#F3ECE4]">
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Real-Time Activity Notifications</h4>
                  <p className="text-xs text-[#78716C]">Receive live alerts when assigned to tasks or mentioned</p>
                </div>
                <div className="w-12 h-6 bg-[#D47E30] rounded-full p-1 flex items-center justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FFFBF7] rounded-2xl border border-[#F3ECE4]">
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Default Workspace Theme</h4>
                  <p className="text-xs text-[#78716C]">Warm Terracotta & Cream</p>
                </div>
                <span className="text-xs font-bold text-[#D47E30] bg-[#FFF5EB] px-3 py-1 rounded-full border border-[#FDE3CE]">
                  Active
                </span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#F3ECE4] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-[#475569] bg-[#FFFBF7] border border-[#E5E7EB] rounded-2xl hover:bg-[#DFDBD4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 text-xs font-bold text-white bg-[#D47E30] hover:bg-[#B96322] rounded-2xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
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
