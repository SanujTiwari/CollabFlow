import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios";

const WorkspaceActivity = () => {
  const { workspaceId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get(`/workspaces/${workspaceId}/activities`);
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [workspaceId]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto max-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Activity Feed</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time audit log of team actions in this workspace</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="glass-panel rounded-2xl text-center py-16 px-6 max-w-md mx-auto border border-white/10 shadow-xl">
          <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-violet-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">No activity logged yet</h2>
          <p className="text-xs text-gray-400">Actions like creating boards, moving tasks, and commenting will show up here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-violet-500/30 transition-all shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-md">
                  {activity.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    <span className="font-bold text-white">{activity.user?.name}</span>{" "}
                    <span className="text-gray-300">{activity.action}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20 flex-shrink-0">
                {formatTime(activity.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceActivity;
