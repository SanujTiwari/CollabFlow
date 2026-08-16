import { useNavigate } from "react-router-dom";

const gradients = [
  "from-violet-600 to-indigo-600",
  "from-rose-600 to-pink-600",
  "from-emerald-600 to-teal-600",
  "from-amber-600 to-orange-600",
  "from-cyan-600 to-blue-600",
  "from-fuchsia-600 to-purple-600",
];

const WorkspaceCard = ({ workspace }) => {
  const navigate = useNavigate();
  const gradientIndex =
    workspace.name.charCodeAt(0) % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      onClick={() => navigate(`/workspace/${workspace.id}`)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 cursor-pointer group"
    >
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-white font-bold text-lg">
          {workspace.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-violet-400 transition-colors">
        {workspace.name}
      </h3>
      {workspace.description && (
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
          {workspace.description}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <span>{workspace._count?.members || workspace.memberCount || 1} member{(workspace._count?.members || workspace.memberCount || 1) !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
};

export default WorkspaceCard;
