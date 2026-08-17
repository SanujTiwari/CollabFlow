import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountSettingsModal from "./AccountSettingsModal";

const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Top-Right Profile Trigger Button */}
      <button
        id="user-profile-trigger"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-[#F8F6F2] hover:bg-[#DFDBD4] border border-[#C9C3BB] hover:border-[#8B5E3C] p-1.5 pr-3 rounded-full transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#D47E30]/30"
      >
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#D47E30]/30 group-hover:ring-[#D47E30]/50 transition-all shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-xs ring-2 ring-[#D47E30]/30 group-hover:ring-[#D47E30]/50 shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full" />
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-[#1E293B] group-hover:text-[#D47E30] transition-colors leading-none">
            {user?.name || "User"}
          </p>
          <p className="text-[10px] text-[#94a3b8] font-medium leading-none mt-0.5">
            Pro Member
          </p>
        </div>

        <svg
          className={`w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#475569] transition-transform duration-200 ${
            open ? "rotate-180 text-[#D47E30]" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#C9C3BB] rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] overflow-hidden animate-fade-in p-2 space-y-2 z-50">
          {/* User Info Header */}
          <div className="p-3 bg-gradient-to-br from-[#FEF3E7] via-[#FDF8F3] to-transparent rounded-xl border border-[#C9C3BB]/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-[#1E293B] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#94a3b8] truncate mt-0.5">{user?.email}</p>
              <span className="inline-block mt-1 text-[9px] font-extrabold text-[#22C55E] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wider">
                Online Active
              </span>
            </div>
          </div>

          {/* Menu Options */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setOpen(false);
                setShowSettings(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#FEF3E7] hover:text-[#D47E30] flex items-center gap-3 transition-colors group"
            >
              <div className="w-7 h-7 bg-[#FEF3E7] rounded-lg flex items-center justify-center text-[#D47E30] group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <div>
                <p className="font-bold text-[#1E293B] group-hover:text-[#D47E30]">Account Settings</p>
                <p className="text-[10px] text-[#94a3b8]">Edit profile, name & avatar</p>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#FEF3E7] hover:text-[#D47E30] flex items-center gap-3 transition-colors group"
            >
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                🚀
              </div>
              <div>
                <p className="font-bold text-[#1E293B] group-hover:text-[#D47E30]">Workspaces Dashboard</p>
                <p className="text-[10px] text-[#94a3b8]">Switch workspace or board</p>
              </div>
            </button>

            {workspaceId && (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(`/workspace/${workspaceId}/analytics`);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#FEF3E7] hover:text-[#D47E30] flex items-center gap-3 transition-colors group"
                >
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <div>
                    <p className="font-bold text-[#1E293B] group-hover:text-[#D47E30]">Workspace Analytics</p>
                    <p className="text-[10px] text-[#94a3b8]">View progress & metrics</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(`/workspace/${workspaceId}/members`);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#FEF3E7] hover:text-[#D47E30] flex items-center gap-3 transition-colors group"
                >
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <div>
                    <p className="font-bold text-[#1E293B] group-hover:text-[#D47E30]">Team Members</p>
                    <p className="text-[10px] text-[#94a3b8]">Roles and access control</p>
                  </div>
                </button>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB]">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#DC2626] hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      {showSettings && (
        <AccountSettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default UserProfileMenu;
