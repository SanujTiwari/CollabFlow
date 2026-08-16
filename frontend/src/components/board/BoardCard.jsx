import { useNavigate } from "react-router-dom";

const boardGradients = [
  "from-violet-600 to-indigo-700",
  "from-rose-600 to-pink-700",
  "from-emerald-600 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-cyan-600 to-blue-700",
];

const BoardCard = ({ board, workspaceId }) => {
  const navigate = useNavigate();
  const gradient = boardGradients[board.title.charCodeAt(0) % boardGradients.length];

  return (
    <div
      onClick={() => navigate(`/workspace/${workspaceId}/board/${board.id}`)}
      className="group cursor-pointer rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200"
    >
      <div className={`h-24 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors">
          {board.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {board._count?.lists || 0} lists
        </p>
      </div>
    </div>
  );
};

export default BoardCard;
