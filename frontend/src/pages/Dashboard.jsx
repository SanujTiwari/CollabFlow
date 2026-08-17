import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import CreateWorkspaceModal from "../components/workspace/CreateWorkspaceModal";
import WorkspaceCard from "../components/workspace/WorkspaceCard";
import UserProfileMenu from "../components/layout/UserProfileMenu";
import CommandPalette from "../components/layout/CommandPalette";

const Dashboard = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-mesh text-gray-100 flex flex-col">
      <CommandPalette />

      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#060810]/85 backdrop-blur-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight">CollabFlow</span>
              <span className="ml-2 text-[10px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Pro
              </span>
            </div>
          </div>

          {/* Search bar & Top-Right User Profile Menu */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="glass-input rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-gray-400 w-52 focus:w-64 transition-all"
              />
            </div>

            {/* TOP RIGHT USER PROFILE MENU */}
            <UserProfileMenu />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Welcome Banner & Overview Metrics */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full inline-block mb-3">
                Workspace Dashboard
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="gradient-accent-text">{user?.name || "Developer"}</span> 👋
              </h1>
              <p className="text-sm text-gray-300 mt-2 max-w-xl">
                Here is an overview of your active workspaces, boards, and real-time collaboration.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-glow text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <span>+ Create Workspace</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs font-semibold text-gray-400">Total Workspaces</p>
              <h2 className="text-2xl font-extrabold text-white mt-1">{workspaces.length}</h2>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs font-semibold text-gray-400">Active Boards</p>
              <h2 className="text-2xl font-extrabold text-violet-400 mt-1">{totalBoardsCount}</h2>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs font-semibold text-gray-400">Team Members</p>
              <h2 className="text-2xl font-extrabold text-indigo-400 mt-1">{totalMembersCount}</h2>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs font-semibold text-gray-400">Socket.IO Status</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-400">Live Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workspaces Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Your Workspaces</h2>
              <p className="text-xs text-gray-400 mt-0.5">Select a workspace to manage boards and tasks</p>
            </div>
            
            <span className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              Showing {filteredWorkspaces.length} of {workspaces.length}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="glass-panel rounded-3xl text-center py-16 px-6 max-w-md mx-auto border border-white/10 shadow-2xl">
              <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-violet-400 text-2xl">
                🚀
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {searchQuery ? "No workspaces found" : "No workspaces created yet"}
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                {searchQuery ? `No workspace matched "${searchQuery}"` : "Create your first workspace to start building Kanban boards."}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-glow text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md"
              >
                Create Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          )}
        </div>

      </main>

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
