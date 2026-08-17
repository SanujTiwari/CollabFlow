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
        className="w-72 flex-shrink-0 bg-white/50 border border-dashed border-[#C9C3BB] rounded-xl p-4 text-sm text-[#94a3b8] hover:text-[#D47E30] hover:border-[#D47E30] hover:bg-[#FEF3E7] transition-all"
      >
        + Add another list
      </button>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 bg-[#F8F6F2] border border-[#C9C3BB] rounded-xl p-3">
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full glass-input rounded-lg px-3 py-2 text-sm mb-2"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium btn-glow rounded-lg disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add List"}
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setTitle(""); }}
            className="px-3 py-1.5 text-xs text-[#94a3b8] hover:text-[#1E293B] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListForm;
