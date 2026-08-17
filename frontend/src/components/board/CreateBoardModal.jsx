import { useState } from "react";
import api from "../../lib/axios";

const CreateBoardModal = ({ workspaceId, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/boards`, { title });
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-[#F8F6F2] rounded-2xl shadow-[0_16px_48px_-8px_rgba(0,0,0,0.15)] w-full max-w-md p-6 sm:p-8 border border-[#C9C3BB] z-10 animate-fade-in overflow-hidden">
        {/* Top decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D47E30] via-[#8B5E3C] to-[#D47E30]" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FEF3E7] border border-[#D47E30]/20 rounded-lg flex items-center justify-center text-[#D47E30] font-bold">
              📊
            </div>
            <h3 className="text-lg font-extrabold text-[#1E293B] tracking-tight">Create Board</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#1E293B] p-1.5 rounded-xl hover:bg-[#DFDBD4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#DC2626] p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Board Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Roadmap & Feature Planning"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium transition-all"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-xs font-bold text-[#475569] bg-white border border-[#C9C3BB] rounded-xl hover:bg-[#DFDBD4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-glow py-3 rounded-xl font-bold text-xs shadow-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
