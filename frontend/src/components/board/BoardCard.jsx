import { useNavigate } from "react-router-dom";

const boardColors = [
  "bg-[#D47E30]",
  "bg-[#8B5E3C]",
  "bg-[#22C55E]",
  "bg-[#3B82F6]",
  "bg-[#A855F7]",
];

const BoardCard = ({ board, workspaceId }) => {
  const navigate = useNavigate();
  const color = boardColors[board.title.charCodeAt(0) % boardColors.length];

  return (
    <div
      onClick={() => navigate(`/workspace/${workspaceId}/board/${board.id}`)}
      className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-[#D47E30] hover:shadow-[0_8px_24px_-4px_rgba(212,126,48,0.12)] transition-all duration-300 group"
    >
      <div className={`h-28 ${color} p-4 flex items-end justify-between relative`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-full relative z-10">
          Kanban Board
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#D47E30] transition-colors tracking-tight">
          {board.title}
        </h3>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E7EB] text-xs text-[#94a3b8] font-medium">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>{board._count?.lists || 0} list{(board._count?.lists || 0) !== 1 ? "s" : ""}</span>
          </div>

          <span className="text-[#D47E30] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-xs">
            Open Board →
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
