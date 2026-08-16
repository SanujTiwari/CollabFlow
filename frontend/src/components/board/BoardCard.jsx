import { useNavigate } from "react-router-dom";

const boardGradients = [
  "from-violet-600 via-indigo-600 to-purple-700",
  "from-rose-600 via-pink-600 to-purple-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-600 to-rose-700",
  "from-cyan-600 via-blue-600 to-indigo-700",
];

const BoardCard = ({ board, workspaceId }) => {
  const navigate = useNavigate();
  const gradient = boardGradients[board.title.charCodeAt(0) % boardGradients.length];

  return (
    <div
      onClick={() => navigate(`/workspace/${workspaceId}/board/${board.id}`)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 group border border-white/10 shadow-xl"
    >
      <div className={`h-28 bg-gradient-to-r ${gradient} p-4 flex items-end justify-between relative`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full relative z-10">
          Kanban Board
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors tracking-tight">
          {board.title}
        </h3>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>{board._count?.lists || 0} list{(board._count?.lists || 0) !== 1 ? "s" : ""}</span>
          </div>

          <span className="text-violet-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-xs">
            Open Board ➔
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
