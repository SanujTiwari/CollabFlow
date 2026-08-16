import { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../lib/axios";
import BoardCard from "../components/board/BoardCard";
import CreateBoardModal from "../components/board/CreateBoardModal";

const WorkspaceBoards = () => {
  const { workspaceId } = useParams();
  const { boards, setBoards } = useOutletContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [newBoard, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Boards</h2>
          <p className="text-gray-400 mt-1">Organize your work with boards</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-violet-500/20"
        >
          + New Board
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No boards yet</h3>
          <p className="text-gray-500 mb-6">Create your first board to start organizing tasks</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
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
