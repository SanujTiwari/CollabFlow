import { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import BoardCard from "../components/board/BoardCard";
import CreateBoardModal from "../components/board/CreateBoardModal";

const WorkspaceBoards = () => {
  const { workspaceId } = useParams();
  const { workspace, boards, setBoards } = useOutletContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [newBoard, ...prev]);
    setShowCreateModal(false);
  };

  const filteredBoards = boards.filter((b) =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto max-h-screen space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Workspace Boards
              </span>
              <span className="text-xs font-semibold text-gray-400">
                {workspace?.name}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Project Boards</h1>
            <p className="text-xs text-gray-400 mt-1">Organize your sprints, tasks, and features across Kanban boards</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-glow text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg"
          >
            + New Board
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search boards by title..."
              className="glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-400 w-64 focus:w-80 transition-all"
            />
          </div>

          <span className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            {filteredBoards.length} board{filteredBoards.length !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>

      {/* Boards Grid */}
      {filteredBoards.length === 0 ? (
        <div className="glass-panel rounded-3xl text-center py-16 px-6 max-w-md mx-auto border border-white/10 shadow-xl">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400 text-2xl">
            📊
          </div>
          <h2 className="text-lg font-bold text-white mb-1">
            {searchQuery ? "No board matched" : "No boards created yet"}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            {searchQuery ? `No board found matching "${searchQuery}"` : "Create your first board to start managing tasks in columns."}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-glow text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md"
          >
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <BoardCard key={board.id} board={board} workspaceId={workspaceId} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateBoardModal
          workspaceId={workspaceId}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleBoardCreated}
        />
      )}
    </div>
  );
};

export default WorkspaceBoards;
