import { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";

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
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} bg-gray-900 border-r border-gray-800 flex-shrink-0 transition-all duration-200 overflow-hidden`}>
        <div className="w-64 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800">
            <Link to="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 mb-3 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Workspaces
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {workspace?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">{workspace?.name}</h2>
                <p className="text-xs text-gray-500 truncate">{workspace?._count?.members || 0} members</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <Link
              to={`/workspace/${workspaceId}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(`/workspace/${workspaceId}`)
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Boards
            </Link>
            <Link
              to={`/workspace/${workspaceId}/members`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(`/workspace/${workspaceId}/members`)
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Members
            </Link>
            <Link
              to={`/workspace/${workspaceId}/activity`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(`/workspace/${workspaceId}/activity`)
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Activity
            </Link>

            {/* Board list */}
            <div className="pt-4 mt-4 border-t border-gray-800">
              <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Your Boards</p>
              {boards.map((board) => (
                <Link
                  key={board.id}
                  to={`/workspace/${workspaceId}/board/${board.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname.includes(board.id)
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <span className="w-2 h-2 rounded-sm bg-gradient-to-br from-violet-400 to-indigo-500 flex-shrink-0" />
                  <span className="truncate">{board.title}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{user?.name}</p>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-white transition-colors" title="Logout">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-2 z-50 p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors lg:hidden"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet context={{ workspace, boards, setBoards }} />
      </main>
    </div>
  );
};

export default WorkspaceLayout;
