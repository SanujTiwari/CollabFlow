import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch workspaces & boards when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const { data: wsData } = await api.get("/workspaces");
        setWorkspaces(wsData);

        if (workspaceId) {
          const { data: bData } = await api.get(`/workspaces/${workspaceId}/boards`);
          setBoards(bData);
        }
      } catch (error) {
        console.error("Failed to fetch command palette items:", error);
      }
    };
    fetchData();
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBoards = boards.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path) => {
    setIsOpen(false);
    setSearch("");
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Window */}
      <div className="relative bg-[#0f1422] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden z-10 animate-fade-in">
        {/* Search Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/30">
          <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search workspace, boards... (ESC to close)"
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          <span className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Quick Actions
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleSelect("/dashboard")}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Go to Workspaces Dashboard</span>
                </div>
                <span className="text-[10px] text-gray-500 group-hover:text-violet-300">Jump</span>
              </button>

              {workspaceId && (
                <>
                  <button
                    onClick={() => handleSelect(`/workspace/${workspaceId}/analytics`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2H11a2 2 0 01-2-2zM13 13h-2v-2h2v2zM5 19v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2zM17 19v-8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>View Workspace Analytics</span>
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-emerald-300">Jump</span>
                  </button>

                  <button
                    onClick={() => handleSelect(`/workspace/${workspaceId}/members`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>View Team Members</span>
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-indigo-300">Jump</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Boards List */}
          {filteredBoards.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Boards in Workspace ({filteredBoards.length})
              </p>
              <div className="space-y-1">
                {filteredBoards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleSelect(`/workspace/${workspaceId}/board/${board.id}`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      <span>{board.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">Board</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workspaces List */}
          {filteredWorkspaces.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Workspaces ({filteredWorkspaces.length})
              </p>
              <div className="space-y-1">
                {filteredWorkspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => handleSelect(`/workspace/${ws.id}`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-violet-600/20 hover:text-white flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 bg-violet-600/40 rounded-md flex items-center justify-center text-[10px] font-bold text-violet-300">
                        {ws.name.charAt(0)}
                      </div>
                      <span>{ws.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">Workspace</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-black/20 text-center text-[11px] text-gray-500">
          Pro-tip: Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-gray-400">Ctrl + K</kbd> anywhere to open this menu
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
