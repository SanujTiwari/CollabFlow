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
      className="bg-white border border-[#E5E0D8] hover:border-[#D47E30] rounded-2xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_30px_-6px_rgba(212,126,48,0.14)] transition-all duration-300 group relative overflow-hidden active-press"
    >
      {/* Top ambient color glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D47E30] to-[#8B5E3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${gradient} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-1 transition-all duration-300`}>
          <span className="text-white font-extrabold text-lg">
            {workspace.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#D47E30] bg-[#FEF3E7] border border-[#D47E30]/20 px-2.5 py-1 rounded-full group-hover:bg-[#D47E30] group-hover:text-white transition-colors">
          {workspace._count?.boards || 0} board{(workspace._count?.boards || 0) !== 1 ? "s" : ""}
        </span>
      </div>

      <h3 className="text-base font-extrabold text-[#1E293B] group-hover:text-[#D47E30] transition-colors tracking-tight">
        {workspace.name}
      </h3>
      {workspace.description ? (
        <p className="text-xs text-[#64748B] line-clamp-2 mt-2 font-normal leading-relaxed">
          {workspace.description}
        </p>
      ) : (
        <p className="text-xs text-[#94A3B8] italic mt-2">No description provided</p>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F1EDE6] text-xs text-[#64748B] font-medium">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{workspace._count?.members || 1} member{(workspace._count?.members || 1) !== 1 ? "s" : ""}</span>
        </div>

        <span className="text-[#D47E30] font-bold group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
          Open space →
        </span>
      </div>
    </div>
  );
};

export default WorkspaceCard;
