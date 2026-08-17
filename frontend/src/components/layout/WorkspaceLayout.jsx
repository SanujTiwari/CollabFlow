import { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";
import CommandPalette from "./CommandPalette";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const { data } = await api.get(`/workspaces/${workspaceId}`);
        setWorkspace(data);
      } catch (error) {
        console.error("Failed to fetch workspace:", error);
        navigate("/dashboard");
      }
    };
    const fetchBoards = async () => {
      try {
        const { data } = await api.get(`/workspaces/${workspaceId}/boards`);
        setBoards(data);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      }
    };
    fetchWorkspace();
    fetchBoards();
  }, [workspaceId, navigate]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex overflow-hidden">
      <CommandPalette />
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 opacity-0"
        } bg-[#0b0e17]/90 backdrop-blur-xl border-r border-white/10 flex-shrink-0 transition-all duration-300 overflow-hidden relative z-30`}
      >
        <div className="w-64 h-full flex flex-col justify-between">
          <div>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-white/10">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 mb-4 transition-colors group"
              >
                <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Workspaces
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
                  <span className="text-white font-bold text-base">
                    {workspace?.name?.charAt(0)?.toUpperCase() || "W"}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white truncate tracking-tight">{workspace?.name || "Loading..."}</h2>
                  <p className="text-xs text-gray-400 font-medium truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {workspace?._count?.members || 1} member{(workspace?._count?.members || 1) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Workspace</p>
              
              <Link
                to={`/workspace/${workspaceId}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(`/workspace/${workspaceId}`)
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-300 border-l-2 border-violet-500 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Boards
              </Link>
              
              <Link
                to={`/workspace/${workspaceId}/analytics`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(`/workspace/${workspaceId}/analytics`)
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-300 border-l-2 border-violet-500 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2H11a2 2 0 01-2-2zM13 13h-2v-2h2v2zM5 19v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2zM17 19v-8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
              
              <Link
                to={`/workspace/${workspaceId}/members`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(`/workspace/${workspaceId}/members`)
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-300 border-l-2 border-violet-500 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Members
              </Link>
              
              <Link
                to={`/workspace/${workspaceId}/activity`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(`/workspace/${workspaceId}/activity`)
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-300 border-l-2 border-violet-500 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activity Feed
              </Link>

              {/* Boards list */}
              <div className="pt-5 mt-4 border-t border-white/10">
                <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Boards ({boards.length})</p>
                {boards.map((board) => {
                  const isBoardActive = location.pathname.includes(board.id);
                  return (
                    <Link
                      key={board.id}
                      to={`/workspace/${workspaceId}/board/${board.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                        isBoardActive
                          ? "bg-violet-500/15 text-white font-medium shadow-sm"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isBoardActive ? "bg-violet-400 ring-4 ring-violet-500/20" : "bg-gray-600"}`} />
                      <span className="truncate">{board.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-40 p-2 rounded-xl bg-gray-900/90 border border-white/10 text-gray-300 hover:text-white transition-all shadow-lg"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <main className="flex-1 overflow-hidden">
          <Outlet context={{ workspace, boards, setBoards }} />
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
