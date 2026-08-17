import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import CreateWorkspaceModal from "../components/workspace/CreateWorkspaceModal";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import UserProfileMenu from "../components/layout/UserProfileMenu";
import CommandPalette from "../components/layout/CommandPalette";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Workspaces", icon: "workspaces" },
  { label: "Boards", icon: "boards" },
  { label: "Tasks", icon: "tasks" },
  { label: "Calendar", icon: "calendar" },
  { label: "Activity", icon: "activity" },
  { label: "Members", icon: "members" },
  { label: "Settings", icon: "settings" },
];

const NavIcon = ({ icon, className = "" }) => {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    workspaces: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    boards: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    tasks: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    activity: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    members: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return icons[icon] || null;
};

const WORKSPACE_COLORS = ["bg-[#D47E30]", "bg-[#8B5E3C]", "bg-[#22C55E]", "bg-[#3B82F6]", "bg-[#A855F7]", "bg-[#EF4444]"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");

  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get("/workspaces");
      setWorkspaces(data);
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleWorkspaceCreated = (newWorkspace) => {
    setWorkspaces((prev) => [newWorkspace, ...prev]);
    setShowCreateModal(false);
  };

  const filteredWorkspaces = workspaces.filter(
    (w) =>
      !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBoardsCount = workspaces.reduce((acc, w) => acc + (w._count?.boards || 0), 0);
  const totalMembersCount = workspaces.reduce((acc, w) => acc + (w._count?.members || 0), 0);

  return (
    <div className="min-h-screen bg-[#DFDBD4] flex">
      <CommandPalette />

      {/* ─── Left Sidebar ─── */}
      <aside className="w-[260px] bg-white border-r border-[#C9C3BB] flex-shrink-0 flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#D47E30] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1E293B] tracking-tight">CollabFlow</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeNav === item.label
                  ? "bg-[#FEF3E7] text-[#D47E30] font-semibold"
                  : "text-[#475569] hover:bg-[#F8F6F2] hover:text-[#1E293B]"
              }`}
            >
              <NavIcon icon={item.icon} className={`w-[18px] h-[18px] ${activeNav === item.label ? "text-[#D47E30]" : "text-[#94a3b8]"}`} />
              {item.label}
            </button>
          ))}

          {/* Starred Workspaces */}
          {workspaces.length > 0 && (
            <div className="pt-5 mt-3 border-t border-[#E5E7EB]">
              <p className="px-3 text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Starred Workspaces</p>
              {workspaces.slice(0, 4).map((ws, i) => (
                <button
                  key={ws.id}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#F8F6F2] hover:text-[#1E293B] transition-all group"
                >
                  <div className={`w-6 h-6 ${WORKSPACE_COLORS[i % WORKSPACE_COLORS.length]} rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate font-medium">{ws.name}</span>
                  {i === 0 && <span className="ml-auto text-amber-400 text-xs">★</span>}
                </button>
              ))}
              {workspaces.length > 4 && (
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#475569] hover:text-[#D47E30] transition-colors">
                  View all
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Bottom: User Profile */}
        <div className="px-3 py-3 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#F8F6F2] transition-all cursor-pointer group">
            <div className="w-9 h-9 bg-[#D47E30] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1E293B] truncate">{user?.name || "User"}</p>
              <p className="text-[11px] text-[#94a3b8] truncate">Owner</p>
            </div>
            <svg className="w-4 h-4 text-[#94a3b8] group-hover:text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-white border-b border-[#C9C3BB] flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-bold text-[#1E293B]">Dashboard</h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <svg className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="glass-input rounded-lg pl-9 pr-16 py-2 text-sm w-56 focus:w-72 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#94a3b8] bg-[#F1F1EF] px-1.5 py-0.5 rounded border border-[#C9C3BB]">⌘ K</kbd>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-[#475569] hover:bg-[#F8F6F2] hover:text-[#1E293B] transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D47E30] rounded-full" />
            </button>

            {/* + New Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5"
            >
              <span>+</span>
              <span>New</span>
              <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Profile Menu */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Welcome Banner */}
          <div className="bg-[#F8F6F2] rounded-2xl p-6 sm:p-8 border border-[#C9C3BB] relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                  Welcome back, {user?.name || "Developer"}! 👋
                </h2>
                <p className="text-sm text-[#475569] mt-1.5">
                  Here's what's happening in your workspaces today.
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-glow px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    Create Workspace
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button className="bg-white border border-[#C9C3BB] text-[#1E293B] px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:border-[#8B5E3C] transition-all hover:shadow-sm">
                    Invite Members
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Decorative illustration placeholder */}
              <div className="hidden lg:block w-48 h-32 relative">
                <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
                  {/* People illustration - simplified */}
                  <rect x="30" y="50" width="40" height="60" rx="8" fill="#D47E30" opacity="0.15" />
                  <circle cx="50" cy="40" r="15" fill="#D47E30" opacity="0.2" />
                  <rect x="80" y="40" width="40" height="70" rx="8" fill="#8B5E3C" opacity="0.15" />
                  <circle cx="100" cy="30" r="15" fill="#8B5E3C" opacity="0.2" />
                  <rect x="130" y="55" width="40" height="55" rx="8" fill="#D47E30" opacity="0.12" />
                  <circle cx="150" cy="45" r="15" fill="#D47E30" opacity="0.18" />
                  {/* Desk */}
                  <rect x="20" y="105" width="160" height="6" rx="3" fill="#C9C3BB" opacity="0.4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Workspaces", value: workspaces.length, color: "bg-[#D47E30]", growth: `${workspaces.length > 0 ? "+" : ""}${workspaces.length > 2 ? 2 : workspaces.length} this week` },
              { label: "Boards", value: totalBoardsCount, color: "bg-[#3B82F6]", growth: `↑ ${Math.min(totalBoardsCount, 4)} this week` },
              { label: "Tasks", value: "—", color: "bg-[#22C55E]", growth: "Active" },
              { label: "Members", value: totalMembersCount, color: "bg-[#A855F7]", growth: `${totalMembersCount > 0 ? "↑ " + Math.min(totalMembersCount, 3) : "0"} this week` },
              { label: "Due Today", value: "—", color: "bg-[#EF4444]", growth: "View tasks →" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center opacity-90`}>
                    <span className="text-white text-sm font-bold">{String(stat.value).charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#1E293B]">{stat.value}</p>
                    <p className="text-xs text-[#94a3b8] font-medium">{stat.label}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#D47E30] font-semibold mt-2">{stat.growth}</p>
              </div>
            ))}
          </div>

          {/* Content Grid: Workspaces + Activity + Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Your Workspaces */}
            <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1E293B]">Your Workspaces</h3>
                <button className="text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors">View all</button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-[#E5E7EB] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredWorkspaces.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[#94a3b8]">No workspaces yet</p>
                  <button onClick={() => setShowCreateModal(true)} className="mt-3 text-sm text-[#D47E30] font-semibold hover:text-[#B96322]">
                    + Create Workspace
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredWorkspaces.slice(0, 5).map((ws, i) => (
                    <button
                      key={ws.id}
                      onClick={() => navigate(`/workspace/${ws.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all group text-left"
                    >
                      <div className={`w-9 h-9 ${WORKSPACE_COLORS[i % WORKSPACE_COLORS.length]} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1E293B] truncate group-hover:text-[#D47E30] transition-colors">{ws.name}</p>
                        <p className="text-[11px] text-[#94a3b8]">{ws._count?.members || 1} members</p>
                      </div>
                      {i === 0 && <span className="text-amber-400 text-sm">★</span>}
                      <svg className="w-4 h-4 text-[#C9C3BB] group-hover:text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full mt-4 py-2.5 border border-dashed border-[#D47E30] text-[#D47E30] rounded-xl text-sm font-semibold hover:bg-[#FEF3E7] transition-all"
              >
                + Create Workspace
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1E293B]">Recent Activity</h3>
                <button className="text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors">View all</button>
              </div>

              {workspaces.length > 0 ? (
                <div className="space-y-4">
                  {workspaces.slice(0, 4).map((ws, i) => (
                    <div key={ws.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#1E293B]">
                          <span className="font-semibold">{user?.name || "You"}</span>
                          {i === 0 ? " created workspace " : i === 1 ? " updated " : i === 2 ? " added members to " : " modified "}
                          <span className="font-semibold">"{ws.name}"</span>
                        </p>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5">{i === 0 ? "Just now" : `${i * 2 + 1}h ago`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#94a3b8] text-center py-8">No recent activity</p>
              )}
            </div>

            {/* Upcoming */}
            <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1E293B]">Upcoming</h3>
                <button className="text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors">View calendar</button>
              </div>

              <div className="space-y-3">
                {[
                  { month: "AUG", day: "18", title: "Team Standup", time: "10:00 AM – 10:30 AM" },
                  { month: "AUG", day: "18", title: "Design Review", time: "2:00 PM – 3:00 PM" },
                  { month: "AUG", day: "19", title: "Sprint Planning", time: "11:00 AM – 12:30 PM" },
                  { month: "AUG", day: "20", title: "Client Meeting", time: "3:00 PM – 4:00 PM" },
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-all">
                    <div className="w-12 h-12 bg-white border border-[#C9C3BB] rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-[#D47E30] uppercase">{event.month}</span>
                      <span className="text-base font-extrabold text-[#1E293B] leading-none">{event.day}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1E293B]">{event.title}</p>
                      <p className="text-[11px] text-[#94a3b8]">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-3 text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors flex items-center justify-end gap-1">
                View full calendar
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Workspace Cards Grid (full view) */}
          {filteredWorkspaces.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">All Workspaces</h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">Select a workspace to manage boards and tasks</p>
                </div>
                <span className="text-xs font-medium text-[#94a3b8] bg-[#F8F6F2] border border-[#C9C3BB] px-3 py-1.5 rounded-full">
                  {filteredWorkspaces.length} of {workspaces.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-[#C9C3BB] bg-white flex items-center justify-between text-xs text-[#94a3b8]">
          <span>© 2026 CollabFlow. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#475569] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#475569] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#475569] cursor-pointer transition-colors">Contact Us</span>
          </div>
        </footer>
      </div>

      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleWorkspaceCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
