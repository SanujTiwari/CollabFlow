import { useNavigate } from "react-router-dom";

const gradients = [
  "bg-[#D47E30]",
  "bg-[#8B5E3C]",
  "bg-[#22C55E]",
  "bg-[#3B82F6]",
  "bg-[#A855F7]",
  "bg-[#EF4444]",
];

const WorkspaceCard = ({ workspace }) => {
  const navigate = useNavigate();
  const gradientIndex = workspace.name.charCodeAt(0) % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      onClick={() => navigate(`/workspace/${workspace.id}`)}
      className="bg-[#F8F6F2] border border-[#C9C3BB] rounded-2xl p-6 cursor-pointer hover:-translate-y-1 hover:border-[#D47E30] hover:shadow-[0_8px_24px_-4px_rgba(212,126,48,0.12)] transition-all duration-300 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-white font-black text-xl">
            {workspace.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#D47E30] bg-[#FEF3E7] border border-[#D47E30]/20 px-2.5 py-1 rounded-full">
          {workspace._count?.boards || 0} boards
        </span>
      </div>

      <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#D47E30] transition-colors tracking-tight">
        {workspace.name}
      </h3>
      {workspace.description && (
        <p className="text-xs text-[#94a3b8] line-clamp-2 mt-2 font-normal leading-relaxed">
          {workspace.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB] text-xs text-[#94a3b8] font-medium">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{workspace._count?.members || 1} member{(workspace._count?.members || 1) !== 1 ? "s" : ""}</span>
        </div>

        <span className="text-[#D47E30] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Open →
        </span>
      </div>
    </div>
  );
};

export default WorkspaceCard;
