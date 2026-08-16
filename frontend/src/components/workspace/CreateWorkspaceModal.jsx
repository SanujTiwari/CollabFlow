import { useState } from "react";
import api from "../../lib/axios";

const CreateWorkspaceModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/workspaces", { name, description });
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Create Workspace</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Workspace Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing Team"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this workspace for?"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
