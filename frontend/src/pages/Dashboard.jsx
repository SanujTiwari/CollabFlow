import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import CreateWorkspaceModal from "../components/workspace/CreateWorkspaceModal";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import UserProfileMenu from "../components/layout/UserProfileMenu";
import CommandPalette from "../components/layout/CommandPalette";
import AccountSettingsModal from "../components/layout/AccountSettingsModal";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard" },
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [allBoards, setAllBoards] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");

  const fetchWorkspacesData = async () => {
    try {
      const { data: wsList } = await api.get("/workspaces");
      setWorkspaces(wsList);

      // Fetch details for all workspaces (boards, members, activities)
      const boardPromises = wsList.map((ws) =>
        api.get(`/workspaces/${ws.id}/boards`).then((res) =>
          res.data.map((b) => ({ ...b, workspaceName: ws.name, workspaceId: ws.id }))
        ).catch(() => [])
      );
      const memberPromises = wsList.map((ws) =>
        api.get(`/workspaces/${ws.id}/members`).then((res) =>
          res.data.map((m) => ({ ...m, workspaceName: ws.name }))
        ).catch(() => [])
      );
      const activityPromises = wsList.map((ws) =>
        api.get(`/workspaces/${ws.id}/activities`).then((res) =>
          res.data.map((a) => ({ ...a, workspaceName: ws.name }))
        ).catch(() => [])
      );

      const boardsResults = await Promise.all(boardPromises);
      const membersResults = await Promise.all(memberPromises);
      const activitiesResults = await Promise.all(activityPromises);

      setAllBoards(boardsResults.flat());
      setAllMembers(membersResults.flat());
      setAllActivities(activitiesResults.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspacesData();
  }, []);

  const handleWorkspaceCreated = (newWorkspace) => {
    setWorkspaces((prev) => [newWorkspace, ...prev]);
    setShowCreateModal(false);
    fetchWorkspacesData();
  };

  const filteredWorkspaces = workspaces.filter(
    (w) =>
      !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBoards = allBoards.filter(
    (b) =>
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.workspaceName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBoardsCount = workspaces.reduce((acc, w) => acc + (w._count?.boards || 0), 0);
  const totalMembersCount = workspaces.reduce((acc, w) => acc + (w._count?.members || 0), 0);

  const handleNavClick = (label) => {
    if (label === "Settings") {
      setShowSettingsModal(true);
    } else {
      setActiveNav(label);
    }
  };

  return (
    <div className="min-h-screen bg-[#DFDBD4] flex">
      <CommandPalette />

      {/* ─── Left Sidebar ─── */}
      <aside className="w-[260px] bg-white border-r border-[#C9C3BB] flex-shrink-0 flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveNav("Dashboard")}>
            <div className="w-9 h-9 bg-[#D47E30] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1E293B] tracking-tight">CollabFlow</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeNav === item.label
                  ? "bg-[#FEF3E7] text-[#D47E30] font-semibold shadow-sm"
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
                <button
                  onClick={() => setActiveNav("Workspaces")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#475569] hover:text-[#D47E30] transition-colors"
                >
                  View all
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Bottom: User Profile Trigger */}
        <div className="px-3 py-3 border-t border-[#E5E7EB]">
          <div
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#F8F6F2] transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 bg-[#D47E30] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1E293B] truncate">{user?.name || "User"}</p>
              <p className="text-[11px] text-[#94a3b8] truncate">Owner • Settings</p>
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
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#1E293B]">{activeNav}</h1>
            {activeNav !== "Dashboard" && (
              <span className="text-xs text-[#94a3b8] bg-[#F8F6F2] px-2.5 py-1 rounded-full border border-[#C9C3BB]">
                Overview
              </span>
            )}
          </div>

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
              <span>New Workspace</span>
            </button>

            {/* User Profile Menu */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Dynamic Page Content Based on activeNav */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* VIEW 1: DASHBOARD MAIN OVERVIEW */}
          {activeNav === "Dashboard" && (
            <>
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
                      <button
                        onClick={() => setActiveNav("Members")}
                        className="bg-white border border-[#C9C3BB] text-[#1E293B] px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:border-[#8B5E3C] transition-all hover:shadow-sm"
                      >
                        Invite Members
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="hidden lg:block w-48 h-32 relative">
                    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
                      <rect x="30" y="50" width="40" height="60" rx="8" fill="#D47E30" opacity="0.15" />
                      <circle cx="50" cy="40" r="15" fill="#D47E30" opacity="0.2" />
                      <rect x="80" y="40" width="40" height="70" rx="8" fill="#8B5E3C" opacity="0.15" />
                      <circle cx="100" cy="30" r="15" fill="#8B5E3C" opacity="0.2" />
                      <rect x="130" y="55" width="40" height="55" rx="8" fill="#D47E30" opacity="0.12" />
                      <circle cx="150" cy="45" r="15" fill="#D47E30" opacity="0.18" />
                      <rect x="20" y="105" width="160" height="6" rx="3" fill="#C9C3BB" opacity="0.4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "Workspaces", value: workspaces.length, color: "bg-[#D47E30]", navTarget: "Workspaces" },
                  { label: "Boards", value: totalBoardsCount, color: "bg-[#3B82F6]", navTarget: "Boards" },
                  { label: "Tasks", value: "—", color: "bg-[#22C55E]", navTarget: "Tasks" },
                  { label: "Members", value: totalMembersCount, color: "bg-[#A855F7]", navTarget: "Members" },
                  { label: "Due Today", value: "—", color: "bg-[#EF4444]", navTarget: "Calendar" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    onClick={() => setActiveNav(stat.navTarget)}
                    className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center opacity-90 text-white font-bold text-sm`}>
                        {String(stat.value).charAt(0)}
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-[#1E293B] group-hover:text-[#D47E30] transition-colors">{stat.value}</p>
                        <p className="text-xs text-[#94a3b8] font-medium">{stat.label}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#D47E30] font-semibold mt-2 group-hover:underline">View {stat.label} →</p>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Your Workspaces */}
                <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#1E293B]">Your Workspaces</h3>
                    <button onClick={() => setActiveNav("Workspaces")} className="text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors">
                      View all
                    </button>
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
                    <button onClick={() => setActiveNav("Activity")} className="text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors">
                      View all
                    </button>
                  </div>

                  {allActivities.length > 0 ? (
                    <div className="space-y-4">
                      {allActivities.slice(0, 4).map((act) => (
                        <div key={act.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#1E293B]">
                              <span className="font-semibold">{act.user?.name || "User"}</span>{" "}
                              <span>{act.action}</span>
                            </p>
                            <p className="text-[11px] text-[#94a3b8] mt-0.5">{act.workspaceName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#94a3b8] text-center py-8">No recent activity logged</p>
                  )}
                </div>

                {/* Upcoming Calendar */}
                <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#1E293B]">Upcoming</h3>
                    <button onClick={() => setActiveNav("Calendar")} className="text-xs text-[#D47E30] font-semibold hover:text-[#B96322] transition-colors">
                      View calendar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { month: "AUG", day: "18", title: "Sprint Review", time: "10:00 AM – 10:30 AM" },
                      { month: "AUG", day: "18", title: "Design Feedback", time: "2:00 PM – 3:00 PM" },
                      { month: "AUG", day: "19", title: "Team Planning", time: "11:00 AM – 12:30 PM" },
                      { month: "AUG", day: "20", title: "Release Deployment", time: "3:00 PM – 4:00 PM" },
                    ].map((event, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-all cursor-pointer" onClick={() => setActiveNav("Calendar")}>
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
                </div>
              </div>

              {/* Workspace Cards Grid */}
              {filteredWorkspaces.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#1E293B]">All Workspaces</h3>
                      <p className="text-xs text-[#94a3b8] mt-0.5">Select a workspace to manage boards and tasks</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredWorkspaces.map((workspace) => (
                      <WorkspaceCard key={workspace.id} workspace={workspace} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* VIEW 2: WORKSPACES TAB */}
          {activeNav === "Workspaces" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1E293B]">Workspaces Overview</h2>
                  <p className="text-sm text-[#94a3b8] mt-1">Manage and access all your team workspaces</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-glow px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  + New Workspace
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: BOARDS TAB */}
          {activeNav === "Boards" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1E293B]">All Workspace Boards</h2>
                  <p className="text-sm text-[#94a3b8] mt-1">Directly access Kanban boards across all your workspaces</p>
                </div>
              </div>

              {filteredBoards.length === 0 ? (
                <div className="bg-[#F8F6F2] rounded-2xl p-12 text-center border border-[#C9C3BB]">
                  <p className="text-[#94a3b8] text-sm">No boards created yet.</p>
                  <p className="text-xs text-[#94a3b8] mt-1">Open a workspace to create your first Kanban board.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBoards.map((board) => (
                    <div
                      key={board.id}
                      onClick={() => navigate(`/workspace/${board.workspaceId}/board/${board.id}`)}
                      className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-5 hover:border-[#D47E30] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#D47E30] bg-[#FEF3E7] px-2.5 py-1 rounded-full border border-[#D47E30]/20">
                          {board.workspaceName}
                        </span>
                        <span className="text-xs text-[#94a3b8]">Kanban</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#D47E30] transition-colors">{board.title}</h3>
                      <p className="text-xs text-[#D47E30] font-bold mt-4 inline-flex items-center gap-1">
                        Open Board →
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: TASKS TAB */}
          {activeNav === "Tasks" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E293B]">All Tasks Overview</h2>
                <p className="text-sm text-[#94a3b8] mt-1">Aggregated task list across your workspaces</p>
              </div>

              <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#1E293B]">Assigned & Active Tasks</h3>
                  <span className="text-xs text-[#94a3b8] bg-white border border-[#C9C3BB] px-3 py-1 rounded-full font-semibold">
                    {allBoards.length} Boards connected
                  </span>
                </div>

                <div className="space-y-3">
                  {allBoards.length > 0 ? (
                    allBoards.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => navigate(`/workspace/${b.workspaceId}/board/${b.id}`)}
                        className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#D47E30] cursor-pointer transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#1E293B]">{b.title}</p>
                          <p className="text-xs text-[#94a3b8]">{b.workspaceName} Workspace</p>
                        </div>
                        <span className="text-xs font-bold text-[#D47E30]">View Board Tasks →</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#94a3b8] text-center py-6">No active tasks or boards found.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: CALENDAR TAB */}
          {activeNav === "Calendar" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E293B]">Schedule & Deadlines</h2>
                <p className="text-sm text-[#94a3b8] mt-1">Upcoming milestones, sprints, and task due dates</p>
              </div>

              <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { date: "Today", title: "Team Daily Standup", time: "10:00 AM", category: "Meeting" },
                    { date: "Aug 18", title: "Q3 Roadmap Sprint Planning", time: "2:00 PM", category: "Sprint" },
                    { date: "Aug 19", title: "Frontend Design Sync", time: "11:30 AM", category: "Review" },
                    { date: "Aug 21", title: "Production Deployment", time: "4:00 PM", category: "Release" },
                  ].map((evt, i) => (
                    <div key={i} className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FEF3E7] border border-[#D47E30]/20 rounded-xl flex flex-col items-center justify-center text-[#D47E30]">
                        <span className="text-xs font-bold">{evt.date}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1E293B]">{evt.title}</p>
                        <p className="text-xs text-[#94a3b8]">{evt.time} • <span className="text-[#D47E30] font-medium">{evt.category}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: ACTIVITY TAB */}
          {activeNav === "Activity" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E293B]">Global Activity Feed</h2>
                <p className="text-sm text-[#94a3b8] mt-1">Real-time audit log of team actions across all workspaces</p>
              </div>

              <div className="space-y-3">
                {allActivities.length > 0 ? (
                  allActivities.map((act) => (
                    <div key={act.id} className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-xs">
                          {act.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1E293B]">
                            <span>{act.user?.name || "User"}</span> <span className="font-normal text-[#475569]">{act.action}</span>
                          </p>
                          <p className="text-xs text-[#94a3b8]">{act.workspaceName}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#D47E30] bg-[#FEF3E7] px-3 py-1 rounded-full border border-[#D47E30]/20">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-12 text-center text-[#94a3b8]">
                    No activity recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 7: MEMBERS TAB */}
          {activeNav === "Members" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1E293B]">Team Members Directory</h2>
                  <p className="text-sm text-[#94a3b8] mt-1">Members and collaborators across your workspaces</p>
                </div>
              </div>

              <div className="space-y-3">
                {allMembers.length > 0 ? (
                  allMembers.map((m) => (
                    <div key={m.id} className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-sm">
                          {m.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1E293B]">{m.user?.name}</p>
                          <p className="text-xs text-[#94a3b8]">{m.user?.email} • Workspace: {m.workspaceName}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#D47E30] bg-[#FEF3E7] border border-[#D47E30]/20 px-3 py-1 rounded-full">
                        {m.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-12 text-center text-[#94a3b8]">
                    No members found.
                  </div>
                )}
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

      {showSettingsModal && (
        <AccountSettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
