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
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 p-1.5 pr-3 rounded-full transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-violet-500/50"
      >
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40 group-hover:ring-violet-400 transition-all shadow-md"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xs ring-2 ring-violet-500/40 group-hover:ring-violet-400 shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#07090e] rounded-full" />
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors leading-none">
            {user?.name || "User"}
          </p>
          <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
            Pro Member
          </p>
        </div>

        <svg
          className={`w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform duration-200 ${
            open ? "rotate-180 text-violet-400" : ""
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
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#0b0e17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in p-2 space-y-2 z-50">
          {/* User Info Header */}
          <div className="p-3 bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-transparent rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
              <span className="inline-block mt-1 text-[9px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
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
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center gap-3 transition-colors group"
            >
              <div className="w-7 h-7 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <div>
                <p className="font-bold">Account Settings</p>
                <p className="text-[10px] text-gray-400">Edit profile, name & avatar</p>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center gap-3 transition-colors group"
            >
              <div className="w-7 h-7 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                🚀
              </div>
              <div>
                <p className="font-bold">Workspaces Dashboard</p>
                <p className="text-[10px] text-gray-400">Switch workspace or board</p>
              </div>
            </button>

            {workspaceId && (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(`/workspace/${workspaceId}/analytics`);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center gap-3 transition-colors group"
                >
                  <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <div>
                    <p className="font-bold">Workspace Analytics</p>
                    <p className="text-[10px] text-gray-400">View progress & metrics</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(`/workspace/${workspaceId}/members`);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center gap-3 transition-colors group"
                >
                  <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <div>
                    <p className="font-bold">Team Members</p>
                    <p className="text-[10px] text-gray-400">Roles and access control</p>
                  </div>
                </button>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center gap-2.5 transition-colors"
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
