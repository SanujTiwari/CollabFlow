import { useState, useEffect } from "react";
import api from "../../lib/axios";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const priorityStyles = {
  LOW: "bg-gray-500/20 text-gray-300 border-gray-500/40",
  MEDIUM: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  HIGH: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  URGENT: "bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20",
};

const availableLabels = [
  { name: "Bug", style: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
  { name: "Feature", style: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { name: "Design", style: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  { name: "Backend", style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { name: "Frontend", style: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { name: "Urgent", style: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
];

const TaskModal = ({ taskId, onClose, onUpdated, onDeleted }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [newCheckitem, setNewCheckitem] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const { data } = await api.get(`/tasks/${taskId}`);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setPriority(data.priority);
        setDueDate(data.dueDate ? data.dueDate.split("T")[0] : "");
        setLabels(data.labels || []);
        setAssignees(data.assignees || []);
        setChecklist(data.checklist || []);
        setComments(data.comments || []);

        // Fetch board to get workspaceId for member listing
        if (data.list?.boardId) {
          const { data: boardData } = await api.get(`/boards/${data.list.boardId}`);
          if (boardData.workspaceId) {
            const { data: memberData } = await api.get(`/workspaces/${boardData.workspaceId}/members`);
            setWorkspaceMembers(memberData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [taskId]);

  const handleSave = async () => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, {
        title,
        description,
        priority,
        dueDate: dueDate || null,
        labels,
      });
      onUpdated({ ...data, checklist, assignees });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${taskId}`);
      onDeleted(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Label toggle
  const toggleLabel = (labelName) => {
    setLabels((prev) =>
      prev.includes(labelName) ? prev.filter((l) => l !== labelName) : [...prev, labelName]
    );
  };

  // Assignee Management
  const handleAssignUser = async (userId) => {
    try {
      const { data } = await api.post(`/tasks/${taskId}/assignees`, { userId });
      setAssignees((prev) => [...prev, data]);
    } catch (error) {
      console.error("Failed to assign user:", error);
    } finally {
      setShowMemberDropdown(false);
    }
  };

  const handleRemoveAssignee = async (userId) => {
    try {
      await api.delete(`/tasks/${taskId}/assignees/${userId}`);
      setAssignees((prev) => prev.filter((a) => a.userId !== userId));
    } catch (error) {
      console.error("Failed to remove assignee:", error);
    }
  };

  // Checklist Management
  const handleAddChecklistItem = async (e) => {
    e.preventDefault();
    if (!newCheckitem.trim()) return;
    try {
      const { data } = await api.post(`/tasks/${taskId}/checklist`, { title: newCheckitem });
      setChecklist((prev) => [...prev, data]);
      setNewCheckitem("");
    } catch (error) {
      console.error("Failed to add checklist item:", error);
    }
  };

  const handleToggleChecklist = async (itemId, isCompleted) => {
    try {
      const { data } = await api.put(`/tasks/checklist/${itemId}`, { isCompleted: !isCompleted });
      setChecklist((prev) => prev.map((item) => (item.id === itemId ? data : item)));
    } catch (error) {
      console.error("Failed to toggle checklist item:", error);
    }
  };

  const handleDeleteChecklistItem = async (itemId) => {
    try {
      await api.delete(`/tasks/checklist/${itemId}`);
      setChecklist((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete checklist item:", error);
    }
  };

  // Comments Management
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { content: comment });
      setComments((prev) => [data, ...prev]);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const totalChecklist = checklist.length;
  const completedChecklist = checklist.filter((c) => c.isCompleted).length;
  const checklistPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-[#0f1422] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden z-10 animate-fade-in">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between bg-black/20">
              <div className="flex-1 mr-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold text-white bg-transparent border-b border-transparent focus:border-violet-500 focus:outline-none w-full tracking-tight transition-colors py-0.5"
                  placeholder="Task title"
                />
                {task?.list && (
                  <p className="text-xs font-semibold text-gray-400 mt-1">
                    in column <span className="text-violet-400 font-bold">{task.list.title}</span>
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: 3-column / 2-column layout */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
              {/* Left Main Content (2 cols) */}
              <div className="md:col-span-2 space-y-6">
                {/* Labels Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Labels / Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableLabels.map((lbl) => {
                      const active = labels.includes(lbl.name);
                      return (
                        <button
                          key={lbl.name}
                          type="button"
                          onClick={() => toggleLabel(lbl.name)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            active
                              ? `${lbl.style} ring-2 ring-violet-500/50 shadow-sm`
                              : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {active ? "✓ " : "+ "}{lbl.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a detailed description for this task..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-all"
                  />
                </div>

                {/* Subtask Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <span>Checklist / Subtasks</span>
                      {totalChecklist > 0 && (
                        <span className="text-violet-400 font-bold">
                          {completedChecklist}/{totalChecklist} ({checklistPercent}%)
                        </span>
                      )}
                    </label>
                  </div>

                  {/* Progress Bar */}
                  {totalChecklist > 0 && (
                    <div className="w-full h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 rounded-full"
                        style={{ width: `${checklistPercent}%` }}
                      />
                    </div>
                  )}

                  {/* Checklist items list */}
                  <div className="space-y-2 mb-3">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/5 group transition-all"
                      >
                        <label className="flex items-center gap-3 flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => handleToggleChecklist(item.id, item.isCompleted)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500 focus:ring-offset-gray-900 cursor-pointer"
                          />
                          <span
                            className={`text-xs font-medium ${
                              item.isCompleted ? "line-through text-gray-500" : "text-gray-200"
                            }`}
                          >
                            {item.title}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteChecklistItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 p-1 rounded-lg transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Checklist Item Form */}
                  <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                    <input
                      value={newCheckitem}
                      onChange={(e) => setNewCheckitem(e.target.value)}
                      placeholder="Add an item to checklist..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 text-xs font-bold text-white bg-white/10 hover:bg-violet-600 rounded-xl transition-colors border border-white/10"
                    >
                      Add Item
                    </button>
                  </form>
                </div>

                {/* Comments Section */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                    <span>Comments ({comments.length})</span>
                  </label>

                  {/* Add Comment Input */}
                  <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-500 transition-colors shadow-md shadow-violet-500/20"
                    >
                      Send
                    </button>
                  </form>
                  
                  {/* Comments List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-sm">
                          {c.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{c.user?.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-gray-400">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-all p-0.5"
                                title="Delete comment"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-xs text-gray-500 italic text-center py-3 bg-white/5 rounded-xl border border-white/5">
                        No comments yet. Start the discussion above!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar Meta Controls (1 col) */}
              <div className="space-y-5 bg-black/20 p-4 rounded-xl border border-white/5">
                {/* Assignees Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Assignees
                  </label>
                  <div className="space-y-2 mb-2">
                    {assignees.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
                            {a.user?.name?.charAt(0) || "U"}
                          </div>
                          <span className="text-xs font-medium text-gray-200">{a.user?.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignee(a.userId)}
                          className="text-gray-500 hover:text-rose-400 text-xs"
                          title="Remove assignee"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Assignee Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                      className="w-full px-3 py-2 text-xs font-bold text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-xl transition-all flex items-center justify-between"
                    >
                      <span>+ Assign Member</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showMemberDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-40 overflow-y-auto p-1">
                        {workspaceMembers.filter(
                          (m) => !assignees.some((a) => a.userId === m.user.id)
                        ).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleAssignUser(m.user.id)}
                            className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center font-bold text-white text-[9px]">
                              {m.user.name.charAt(0)}
                            </div>
                            <span>{m.user.name}</span>
                          </button>
                        ))}
                        {workspaceMembers.filter(
                          (m) => !assignees.some((a) => a.userId === m.user.id)
                        ).length === 0 && (
                          <p className="text-[11px] text-gray-500 p-2 text-center">All members assigned</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {priorityOptions.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                          priority === p
                            ? priorityStyles[p] + " border-current shadow-sm"
                            : "bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  />
                </div>

                {/* Creator Meta */}
                {task?.createdBy && (
                  <div className="pt-3 border-t border-white/10">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Created By
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
                        {task.createdBy.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-300">{task.createdBy.name}</span>
                    </div>
                  </div>
                )}

                {/* Delete Action */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-xl border border-rose-500/20 transition-all"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20"
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
