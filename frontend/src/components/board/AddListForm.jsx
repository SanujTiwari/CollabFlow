import { useState } from "react";
import api from "../../lib/axios";

const AddListForm = ({ boardId, onCreated }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/boards/${boardId}/lists`, { title });
      onCreated(data);
      setTitle("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-72 flex-shrink-0 bg-gray-900/30 border border-dashed border-gray-700 rounded-xl p-4 text-sm text-gray-500 hover:text-gray-300 hover:border-gray-600 hover:bg-gray-900/50 transition-all"
      >
        + Add another list
      </button>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 bg-gray-900 border border-gray-800 rounded-xl p-3">
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 mb-2"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add List"}
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setTitle(""); }}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListForm;
