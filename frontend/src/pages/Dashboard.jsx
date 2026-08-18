import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import CreateWorkspaceModal from "../components/workspace/CreateWorkspaceModal";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import UserProfileMenu from "../components/layout/UserProfileMenu";
import NotificationBell from "../components/layout/NotificationBell";
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
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    workspaces: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    boards: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    tasks: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    activity: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    members: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return icons[icon] || null;
};

const WORKSPACE_COLORS = [
  "bg-[#D47E30]",
  "bg-[#8B5E3C]",
  "bg-[#3B82F6]",
  "bg-[#22C55E]",
  "bg-[#A855F7]",
  "bg-[#EF4444]",
];

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

      const boardPromises = wsList.map((ws) =>
        api
          .get(`/workspaces/${ws.id}/boards`)
          .then((res) =>
            res.data.map((b) => ({
              ...b,
              workspaceName: ws.name,
              workspaceId: ws.id,
            }))
          )
          .catch(() => [])
      );

      const memberPromises = wsList.map((ws) =>
        api
          .get(`/workspaces/${ws.id}/members`)
          .then((res) =>
            res.data.map((m) => ({ ...m, workspaceName: ws.name }))
          )
          .catch(() => [])
      );

      const activityPromises = wsList.map((ws) =>
        api
          .get(`/workspaces/${ws.id}/activities`)
          .then((res) =>
            res.data.map((a) => ({ ...a, workspaceName: ws.name }))
          )
          .catch(() => [])
      );

      const [boardsResults, membersResults, activitiesResults] =
        await Promise.all([
          Promise.all(boardPromises),
          Promise.all(memberPromises),
          Promise.all(activityPromises),
        ]);

      setAllBoards(boardsResults.flat());
      setAllMembers(membersResults.flat());
      setAllActivities(
        activitiesResults
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
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

  const totalBoardsCount = workspaces.reduce(
    (acc, w) => acc + (w._count?.boards || 0),
    0
  );
  const totalMembersCount = workspaces.reduce(
    (acc, w) => acc + (w._count?.members || 0),
    0
  );

  const handleNavClick = (label) => {
    if (label === "Settings") {
      setShowSettingsModal(true);
    } else {
      setActiveNav(label);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] flex text-[#1E293B]">
      <CommandPalette />

      {/* ─── Sidebar ─── */}
      <aside className="w-[248px] bg-white border-r border-[#E5E0D8] flex-shrink-0 flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 pt-5 pb-5">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveNav("Dashboard")}
          >
            <div className="w-8 h-8 bg-[#D47E30] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <svg
                className="w-4.5 h-4.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-[#1E293B]">
              CollabFlow
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#FEF3E7] text-[#D47E30]"
                    : "text-[#64748B] hover:bg-[#F8F6F2] hover:text-[#1E293B]"
                }`}
              >
                <NavIcon
                  icon={item.icon}
                  className={`w-[18px] h-[18px] ${
                    isActive ? "text-[#D47E30]" : "text-[#94A3B8]"
                  }`}
                />
                {item.label}
              </button>
            );
          })}

          {/* Starred */}
          {workspaces.length > 0 && (
            <div className="pt-6 mt-2">
              <p className="px-3 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Starred
              </p>
              <div className="space-y-0.5">
                {workspaces.slice(0, 4).map((ws, i) => (
                  <button
                    key={ws.id}
                    onClick={() => navigate(`/workspace/${ws.id}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#64748B] hover:bg-[#F8F6F2] hover:text-[#1E293B] transition-all group"
                  >
                    <div
                      className={`w-5 h-5 ${WORKSPACE_COLORS[i % WORKSPACE_COLORS.length]} rounded flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0`}
                    >
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate font-medium">{ws.name}</span>
                    {i === 0 && (
                      <span className="ml-auto text-amber-400 text-xs">★</span>
                    )}
                  </button>
                ))}
                {workspaces.length > 4 && (
                  <button
                    onClick={() => setActiveNav("Workspaces")}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[#94A3B8] hover:text-[#D47E30] transition-colors"
                  >
                    View all
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-[#E5E0D8]">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#F8F6F2] transition-all group text-left"
          >
            <div className="w-8 h-8 bg-[#D47E30] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[#1E293B] truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate">Account</p>
            </div>
            <svg
              className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#94A3B8] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v.01M12 12v.01M12 19v.01"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 px-6 bg-white/80 backdrop-blur-sm border-b border-[#E5E0D8] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[15px] font-semibold text-[#1E293B]">
              {activeNav}
            </h1>
            {activeNav !== "Dashboard" && (
              <span className="text-[11px] text-[#94A3B8] bg-[#F8F6F2] px-2 py-0.5 rounded-md">
                Overview
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block">
              <svg
                className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-[#F8F6F2] border border-transparent focus:border-[#E5E0D8] focus:bg-white rounded-lg pl-9 pr-14 py-1.5 text-[13px] w-52 focus:w-64 transition-all outline-none placeholder:text-[#94A3B8]"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#94A3B8] bg-white px-1.5 py-0.5 rounded border border-[#E5E0D8]">
                ⌘K
              </kbd>
            </div>

            {/* Real-Time Notification Bell */}
            <NotificationBell />

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#D47E30] hover:bg-[#C06F28] text-white px-3.5 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="text-[15px] leading-none">+</span>
              New
            </button>

            <UserProfileMenu />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* ── Dashboard ── */}
          {activeNav === "Dashboard" && (
            <div className="space-y-7 max-w-[1200px]">
              {/* Welcome */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="text-[22px] font-semibold tracking-tight text-[#1E293B]">
                    Welcome back, {user?.name?.split(" ")[0] || "there"}
                  </h2>
                  <p className="text-[13.5px] text-[#64748B] mt-1">
                    Here’s a quick look at what’s happening across your workspaces.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#D47E30] hover:bg-[#C06F28] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                  >
                    Create workspace
                  </button>
                  <button
                    onClick={() => setActiveNav("Members")}
                    className="bg-white border border-[#E5E0D8] hover:border-[#D4CCC0] text-[#1E293B] px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                  >
                    Invite people
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    label: "Workspaces",
                    value: workspaces.length,
                    target: "Workspaces",
                  },
                  {
                    label: "Boards",
                    value: totalBoardsCount,
                    target: "Boards",
                  },
                  { label: "Tasks", value: "—", target: "Tasks" },
                  {
                    label: "Members",
                    value: totalMembersCount,
                    target: "Members",
                  },
                  { label: "Due today", value: "—", target: "Calendar" },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => setActiveNav(stat.target)}
                    className="bg-white border border-[#E5E0D8] rounded-xl px-4 py-3.5 text-left hover:border-[#D4CCC0] hover:shadow-sm transition-all group"
                  >
                    <p className="text-[22px] font-semibold tracking-tight text-[#1E293B] group-hover:text-[#D47E30] transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">
                      {stat.label}
                    </p>
                  </button>
                ))}
              </div>

              {/* Three-column content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Workspaces list */}
                <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#F1EDE6] flex items-center justify-between">
                    <h3 className="text-[13.5px] font-semibold text-[#1E293B]">
                      Your workspaces
                    </h3>
                    <button
                      onClick={() => setActiveNav("Workspaces")}
                      className="text-[12px] text-[#D47E30] hover:text-[#C06F28] font-medium transition-colors"
                    >
                      View all
                    </button>
                  </div>

                  <div className="p-2">
                    {loading ? (
                      <div className="space-y-1 p-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-12 bg-[#F8F6F2] rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    ) : filteredWorkspaces.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-[13px] text-[#94A3B8]">
                          No workspaces yet
                        </p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="mt-2 text-[13px] text-[#D47E30] font-medium hover:text-[#C06F28]"
                        >
                          Create one
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {filteredWorkspaces.slice(0, 5).map((ws, i) => (
                          <button
                            key={ws.id}
                            onClick={() => navigate(`/workspace/${ws.id}`)}
                            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg hover:bg-[#F8F6F2] transition-colors text-left group"
                          >
                            <div
                              className={`w-8 h-8 ${WORKSPACE_COLORS[i % WORKSPACE_COLORS.length]} rounded-lg flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0`}
                            >
                              {ws.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-medium text-[#1E293B] truncate group-hover:text-[#D47E30] transition-colors">
                                {ws.name}
                              </p>
                              <p className="text-[11px] text-[#94A3B8]">
                                {ws._count?.members || 1} member
                                {(ws._count?.members || 1) !== 1 ? "s" : ""}
                              </p>
                            </div>
                            {i === 0 && (
                              <span className="text-amber-400 text-sm">★</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-3 pb-3">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="w-full py-2 border border-dashed border-[#E5E0D8] text-[#94A3B8] hover:border-[#D47E30] hover:text-[#D47E30] rounded-lg text-[12.5px] font-medium transition-colors"
                    >
                      + New workspace
                    </button>
                  </div>
                </div>

                {/* Activity */}
                <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#F1EDE6] flex items-center justify-between">
                    <h3 className="text-[13.5px] font-semibold text-[#1E293B]">
                      Recent activity
                    </h3>
                    <button
                      onClick={() => setActiveNav("Activity")}
                      className="text-[12px] text-[#D47E30] hover:text-[#C06F28] font-medium transition-colors"
                    >
                      View all
                    </button>
                  </div>

                  <div className="p-4">
                    {allActivities.length > 0 ? (
                      <div className="space-y-4">
                        {allActivities.slice(0, 4).map((act) => (
                          <div key={act.id} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[13px] text-[#1E293B] leading-snug">
                                <span className="font-medium">
                                  {act.user?.name || "Someone"}
                                </span>{" "}
                                <span className="text-[#64748B]">
                                  {act.action}
                                </span>
                              </p>
                              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                {act.workspaceName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#94A3B8] text-center py-8">
                        No recent activity
                      </p>
                    )}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#F1EDE6] flex items-center justify-between">
                    <h3 className="text-[13.5px] font-semibold text-[#1E293B]">
                      Upcoming
                    </h3>
                    <button
                      onClick={() => setActiveNav("Calendar")}
                      className="text-[12px] text-[#D47E30] hover:text-[#C06F28] font-medium transition-colors"
                    >
                      Calendar
                    </button>
                  </div>

                  <div className="p-3 space-y-1">
                    {[
                      {
                        month: "AUG",
                        day: "18",
                        title: "Sprint review",
                        time: "10:00 – 10:30 AM",
                      },
                      {
                        month: "AUG",
                        day: "18",
                        title: "Design feedback",
                        time: "2:00 – 3:00 PM",
                      },
                      {
                        month: "AUG",
                        day: "19",
                        title: "Team planning",
                        time: "11:00 – 12:30 PM",
                      },
                      {
                        month: "AUG",
                        day: "20",
                        title: "Release deployment",
                        time: "3:00 – 4:00 PM",
                      },
                    ].map((event, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveNav("Calendar")}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F6F2] transition-colors text-left"
                      >
                        <div className="w-11 h-11 bg-[#F8F6F2] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-[9px] font-semibold text-[#D47E30] uppercase tracking-wide">
                            {event.month}
                          </span>
                          <span className="text-[15px] font-semibold text-[#1E293B] leading-none">
                            {event.day}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[#1E293B] truncate">
                            {event.title}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {event.time}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* All workspaces grid */}
              {filteredWorkspaces.length > 0 && (
                <div>
                  <div className="mb-3">
                    <h3 className="text-[14px] font-semibold text-[#1E293B]">
                      All workspaces
                    </h3>
                    <p className="text-[12.5px] text-[#94A3B8] mt-0.5">
                      Open a workspace to manage boards and tasks
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredWorkspaces.map((workspace) => (
                      <WorkspaceCard
                        key={workspace.id}
                        workspace={workspace}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Workspaces ── */}
          {activeNav === "Workspaces" && (
            <div className="space-y-5 max-w-[1200px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
                    Workspaces
                  </h2>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Manage and switch between your team spaces
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#D47E30] hover:bg-[#C06F28] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                >
                  + New workspace
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            </div>
          )}

          {/* ── Boards ── */}
          {activeNav === "Boards" && (
            <div className="space-y-5 max-w-[1200px]">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
                  Boards
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Jump into any Kanban board across your workspaces
                </p>
              </div>

              {filteredBoards.length === 0 ? (
                <div className="bg-white border border-[#E5E0D8] rounded-xl py-16 text-center">
                  <p className="text-[14px] text-[#64748B]">
                    No boards yet
                  </p>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Open a workspace to create your first board
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBoards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() =>
                        navigate(
                          `/workspace/${board.workspaceId}/board/${board.id}`
                        )
                      }
                      className="bg-white border border-[#E5E0D8] rounded-xl p-4 text-left hover:border-[#D4CCC0] hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-medium text-[#D47E30] bg-[#FEF3E7] px-2 py-0.5 rounded">
                          {board.workspaceName}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          Kanban
                        </span>
                      </div>
                      <h3 className="text-[15px] font-medium text-[#1E293B] group-hover:text-[#D47E30] transition-colors">
                        {board.title}
                      </h3>
                      <p className="text-[12px] text-[#D47E30] font-medium mt-3">
                        Open board →
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tasks ── */}
          {activeNav === "Tasks" && (
            <div className="space-y-5 max-w-[900px]">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
                  Tasks
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Boards that contain your active work
                </p>
              </div>

              <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F1EDE6] flex items-center justify-between">
                  <h3 className="text-[13.5px] font-semibold text-[#1E293B]">
                    Connected boards
                  </h3>
                  <span className="text-[11px] text-[#94A3B8]">
                    {allBoards.length} board
                    {allBoards.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="divide-y divide-[#F1EDE6]">
                  {allBoards.length > 0 ? (
                    allBoards.map((b) => (
                      <button
                        key={b.id}
                        onClick={() =>
                          navigate(
                            `/workspace/${b.workspaceId}/board/${b.id}`
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F8F6F2] transition-colors text-left"
                      >
                        <div>
                          <p className="text-[13.5px] font-medium text-[#1E293B]">
                            {b.title}
                          </p>
                          <p className="text-[12px] text-[#94A3B8]">
                            {b.workspaceName}
                          </p>
                        </div>
                        <span className="text-[12px] font-medium text-[#D47E30]">
                          View →
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-[13px] text-[#94A3B8] text-center py-10">
                      No boards found
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Calendar ── */}
          {activeNav === "Calendar" && (
            <div className="space-y-5 max-w-[900px]">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
                  Calendar
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Upcoming meetings and deadlines
                </p>
              </div>

              <div className="bg-white border border-[#E5E0D8] rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      date: "Today",
                      title: "Team daily standup",
                      time: "10:00 AM",
                      category: "Meeting",
                    },
                    {
                      date: "Aug 18",
                      title: "Q3 roadmap planning",
                      time: "2:00 PM",
                      category: "Sprint",
                    },
                    {
                      date: "Aug 19",
                      title: "Frontend design sync",
                      time: "11:30 AM",
                      category: "Review",
                    },
                    {
                      date: "Aug 21",
                      title: "Production deployment",
                      time: "4:00 PM",
                      category: "Release",
                    },
                  ].map((evt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-3 rounded-lg border border-[#F1EDE6] hover:border-[#E5E0D8] transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#FEF3E7] rounded-lg flex items-center justify-center text-[#D47E30] text-[12px] font-semibold flex-shrink-0">
                        {evt.date}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium text-[#1E293B]">
                          {evt.title}
                        </p>
                        <p className="text-[12px] text-[#94A3B8]">
                          {evt.time} ·{" "}
                          <span className="text-[#D47E30]">{evt.category}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Activity ── */}
          {activeNav === "Activity" && (
            <div className="space-y-5 max-w-[800px]">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
                  Activity
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Recent actions across all workspaces
                </p>
              </div>

              <div className="space-y-2">
                {allActivities.length > 0 ? (
                  allActivities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-white border border-[#E5E0D8] rounded-xl px-4 py-3.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D47E30] rounded-full flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
                          {act.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-[13.5px] text-[#1E293B]">
                            <span className="font-medium">
                              {act.user?.name || "User"}
                            </span>{" "}
                            <span className="text-[#64748B]">{act.action}</span>
                          </p>
                          <p className="text-[12px] text-[#94A3B8]">
                            {act.workspaceName}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#E5E0D8] rounded-xl py-16 text-center">
                    <p className="text-[14px] text-[#64748B]">
                      No activity yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Members ── */}
          {activeNav === "Members" && (
            <div className="space-y-5 max-w-[800px]">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
                  Members
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  People across your workspaces
                </p>
              </div>

              <div className="space-y-2">
                {allMembers.length > 0 ? (
                  allMembers.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white border border-[#E5E0D8] rounded-xl px-4 py-3.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#D47E30] rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0">
                          {m.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-medium text-[#1E293B]">
                            {m.user?.name}
                          </p>
                          <p className="text-[12px] text-[#94A3B8]">
                            {m.user?.email} · {m.workspaceName}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#D47E30] bg-[#FEF3E7] px-2.5 py-1 rounded-md">
                        {m.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#E5E0D8] rounded-xl py-16 text-center">
                    <p className="text-[14px] text-[#64748B]">
                      No members found
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3.5 border-t border-[#E5E0D8] bg-white/60 flex items-center justify-between text-[11.5px] text-[#94A3B8]">
          <span>© 2026 CollabFlow</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-[#64748B] transition-colors">
              Privacy
            </button>
            <button className="hover:text-[#64748B] transition-colors">
              Terms
            </button>
            <button className="hover:text-[#64748B] transition-colors">
              Contact
            </button>
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