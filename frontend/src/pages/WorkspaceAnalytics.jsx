import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios";

const WorkspaceAnalytics = () => {
  const { workspaceId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(`/workspaces/${workspaceId}/stats`);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch workspace stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-[#D47E30] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-[#94a3b8]">
        Failed to load workspace analytics.
      </div>
    );
  }

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Workspace Analytics</h1>
          <p className="text-xs text-[#94a3b8] mt-1">Real-time productivity insights and team workload breakdown</p>
        </div>
        <div className="px-3.5 py-1.5 bg-[#FEF3E7] border border-[#D47E30]/20 rounded-xl text-xs font-bold text-[#D47E30] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          Live Metrics
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#F8F6F2] p-5 rounded-2xl border border-[#C9C3BB] relative overflow-hidden group">
          <div className="absolute right-3 top-3 w-10 h-10 bg-[#FEF3E7] rounded-xl flex items-center justify-center text-[#D47E30]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Total Boards</p>
          <p className="text-3xl font-extrabold text-[#1E293B] mt-2">{stats.totalBoards}</p>
        </div>

        <div className="bg-[#F8F6F2] p-5 rounded-2xl border border-[#C9C3BB] relative overflow-hidden group">
          <div className="absolute right-3 top-3 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Total Tasks</p>
          <p className="text-3xl font-extrabold text-[#1E293B] mt-2">{stats.totalTasks}</p>
        </div>

        <div className="bg-[#F8F6F2] p-5 rounded-2xl border border-[#C9C3BB] relative overflow-hidden group">
          <div className="absolute right-3 top-3 w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#22C55E]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-extrabold text-[#22C55E] mt-2">{completionRate}%</p>
          <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#22C55E] rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-[#F8F6F2] p-5 rounded-2xl border border-[#C9C3BB] relative overflow-hidden group">
          <div className="absolute right-3 top-3 w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Active Members</p>
          <p className="text-3xl font-extrabold text-[#1E293B] mt-2">{stats.totalMembers}</p>
        </div>
      </div>

      {/* Middle Section: Priorities & Member Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <div className="bg-[#F8F6F2] p-6 rounded-2xl border border-[#C9C3BB] space-y-4">
          <h3 className="text-base font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Task Priority Distribution
          </h3>

          <div className="space-y-3.5 pt-2">
            {[
              { label: "Low Priority", count: stats.priorityCounts.LOW, color: "bg-gray-400", text: "text-[#475569]" },
              { label: "Medium Priority", count: stats.priorityCounts.MEDIUM, color: "bg-blue-500", text: "text-blue-600" },
              { label: "High Priority", count: stats.priorityCounts.HIGH, color: "bg-amber-500", text: "text-amber-600" },
              { label: "Urgent Priority", count: stats.priorityCounts.URGENT, color: "bg-red-500", text: "text-red-600" },
            ].map((p) => {
              const pct = stats.totalTasks > 0 ? Math.round((p.count / stats.totalTasks) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={p.text}>{p.label}</span>
                    <span className="text-[#475569]">{p.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${p.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Workload */}
        <div className="bg-[#F8F6F2] p-6 rounded-2xl border border-[#C9C3BB] space-y-4">
          <h3 className="text-base font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
            <svg className="w-5 h-5 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Member Workload
          </h3>

          <div className="space-y-3 pt-2 max-h-64 overflow-y-auto pr-1">
            {stats.memberWorkload.map((m) => (
              <div key={m.user.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#D47E30] rounded-full flex items-center justify-center font-bold text-white text-xs">
                    {m.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">{m.user.name}</p>
                    <p className="text-[10px] text-[#94a3b8] font-medium">{m.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#D47E30] bg-[#FEF3E7] px-2.5 py-1 rounded-lg border border-[#D47E30]/20">
                    {m.taskCount} assigned tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity */}
      <div className="bg-[#F8F6F2] p-6 rounded-2xl border border-[#C9C3BB] space-y-4">
        <h3 className="text-base font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Workspace Activity Log
        </h3>

        <div className="space-y-2">
          {stats.recentActivities.map((act) => (
            <div key={act.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="w-2 h-2 rounded-full bg-[#D47E30]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#475569]">
                  <span className="font-bold text-[#1E293B]">{act.user?.name || "Member"}</span> {act.action}
                </p>
              </div>
              <span className="text-[10px] text-[#94a3b8] font-medium">
                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {stats.recentActivities.length === 0 && (
            <p className="text-xs text-[#94a3b8] italic text-center py-4">No recent activity recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAnalytics;
