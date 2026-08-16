import { useState, useEffect } from "react";
import api from "../../lib/axios";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const priorityColors = {
  LOW: "bg-gray-500/20 text-gray-400 border-gray-600",
  MEDIUM: "bg-blue-500/20 text-blue-400 border-blue-600",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-600",
  URGENT: "bg-red-500/20 text-red-400 border-red-600",
};

const TaskModal = ({ taskId, onClose, onUpdated, onDeleted }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/${taskId}`);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setPriority(data.priority);
        setDueDate(data.dueDate ? data.dueDate.split("T")[0] : "");
        setComments(data.comments || []);
      } catch (error) {
        console.error("Failed to fetch task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleSave = async () => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, {
        title,
        description,
        priority,
        dueDate: dueDate || null,
      });
      onUpdated(data);
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { content: comment });
      setComments((prev) => [...prev, data]);
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-start justify-between">
              <div className="flex-1 mr-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                />
                {task?.list && (
                  <p className="text-xs text-gray-500 mt-1">
                    in list <span className="text-gray-400">{task.list.title}</span>
                  </p>
                )}
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none text-sm"
                />
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                  <div className="flex gap-2 flex-wrap">
                    {priorityOptions.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          priority === p
                            ? priorityColors[p] + " border-current"
                            : "bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Comments ({comments.length})
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3 group">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-white font-medium">
                          {c.user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-300">{c.user?.name}</span>
                          <span className="text-xs text-gray-600">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all ml-auto"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-800 flex justify-between">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Delete Task
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
