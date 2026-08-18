import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountSettingsModal from "./AccountSettingsModal";

const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
      {/* Top-Right Profile Trigger Button - ONLY USER AVATAR LOGO */}
      <button
        id="user-profile-trigger"
        onClick={() => setOpen(!open)}
        className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#D47E30]/40 transition-transform active:scale-95 cursor-pointer block"
        title={user?.name || "User Profile"}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D47E30]/40 hover:ring-[#D47E30] transition-all shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-base shadow-sm ring-2 ring-[#D47E30]/30 hover:ring-[#D47E30] transition-all">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#F3ECE4] rounded-3xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] overflow-hidden animate-fade-in p-3 space-y-3 z-50">
          
          {/* User Info Header Box with Delicate Flower SVG Art */}
          <div className="p-4 bg-[#FFF8F2] rounded-2xl border border-[#F8EBDC] relative overflow-hidden">
            {/* Flower Design SVG Art in background */}
            <svg
              className="absolute right-[-10px] top-[-10px] w-28 h-28 text-[#D47E30] opacity-[0.25] pointer-events-none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Central Flower */}
              <circle cx="70" cy="30" r="7" fill="currentColor" fillOpacity="0.5" />
              {/* Petals */}
              <path d="M70 12 C64 22, 64 24, 70 30 C76 24, 76 22, 70 12Z" fill="currentColor" fillOpacity="0.45" />
              <path d="M88 30 C78 24, 76 24, 70 30 C76 36, 78 36, 88 30Z" fill="currentColor" fillOpacity="0.45" />
              <path d="M70 48 C76 38, 76 36, 70 30 C64 36, 64 38, 70 48Z" fill="currentColor" fillOpacity="0.45" />
              <path d="M52 30 C62 36, 64 36, 70 30 C64 24, 62 24, 52 30Z" fill="currentColor" fillOpacity="0.45" />
              {/* Diagonal Petals */}
              <path d="M83 17 C75 23, 73 25, 70 30 C75 33, 77 35, 83 17Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M83 43 C77 35, 75 37, 70 30 C73 35, 75 37, 83 43Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M57 43 C65 37, 63 35, 70 30 C65 33, 63 35, 57 43Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M57 17 C63 25, 65 23, 70 30 C65 23, 63 25, 57 17Z" fill="currentColor" fillOpacity="0.35" />

              {/* Vine and Leaves */}
              <path d="M70 37 Q 50 65 20 85" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
              <path d="M55 52 Q 40 40 35 50 Q 45 60 55 52Z" fill="currentColor" fillOpacity="0.4" />
              <path d="M40 68 Q 25 58 20 68 Q 30 78 40 68Z" fill="currentColor" fillOpacity="0.4" />
            </svg>

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#D47E30]/20 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-xl shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#1E293B] truncate leading-tight">
                    {user?.name || "sanuj"}
                  </h3>
                  <p className="text-xs text-[#78716C] truncate mt-0.5 font-normal">
                    {user?.email || "sanujvirat@gmail.com"}
                  </p>
                  
                  {/* Online Status Badge */}
                  <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#22C55E] bg-[#EFFBF2] border border-[#C6F6D5] px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    Online Active
                  </span>
                </div>
              </div>

              <svg className="w-4 h-4 text-[#8B5E3C] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Menu Action Options */}
          <div className="space-y-1 pt-1">
            {/* Account Settings Option */}
            <button
              onClick={() => {
                setOpen(false);
                setShowSettings(true);
              }}
              className="w-full text-left p-3 rounded-2xl hover:bg-[#FFF8F2] flex items-center gap-3.5 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#FFF5EB] border border-[#FDE3CE] rounded-2xl flex items-center justify-center text-[#D47E30] group-hover:scale-105 transition-transform flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#1E293B] group-hover:text-[#D47E30] transition-colors leading-snug">
                  Account Settings
                </p>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Edit profile, name & avatar
                </p>
              </div>
              <svg className="w-4 h-4 text-[#A8A29E] group-hover:text-[#D47E30] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Workspaces Dashboard Option */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="w-full text-left p-3 rounded-2xl hover:bg-[#FFF8F2] flex items-center gap-3.5 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#FFF5EB] border border-[#FDE3CE] rounded-2xl flex items-center justify-center text-[#D47E30] group-hover:scale-105 transition-transform flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#1E293B] group-hover:text-[#D47E30] transition-colors leading-snug">
                  Workspaces Dashboard
                </p>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Switch workspace or board
                </p>
              </div>
              <svg className="w-4 h-4 text-[#A8A29E] group-hover:text-[#D47E30] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-[#F3ECE4]">
            {/* Sign Out Action */}
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2.5 rounded-2xl text-sm font-bold text-[#D47E30] hover:bg-[#FFF5EB] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
