import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import CreateWorkspaceModal from "../components/workspace/CreateWorkspaceModal";
import WorkspaceCard from "../components/workspace/WorkspaceCard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-xl font-semibold text-white">CollabFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-300">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your Workspaces</h2>
            <p className="text-gray-400 mt-1">Manage your projects and collaborate with your team</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            + New Workspace
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl h-44 animate-pulse"
              />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No workspaces yet</h3>
            <p className="text-gray-500 mb-6">Create your first workspace to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
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
