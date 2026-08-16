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
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-white mb-1">Activity Feed</h2>
      <p className="text-gray-400 mb-8">Recent activity in this workspace</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-14 animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-gray-300 font-medium mb-1">No activity yet</h3>
          <p className="text-gray-500 text-sm">Activity will appear here as team members work</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900/50 transition-colors"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-white font-medium">
                  {activity.user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">{activity.user?.name}</span>{" "}
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-gray-600 flex-shrink-0">{formatTime(activity.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceActivity;
