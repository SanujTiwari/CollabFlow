import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import api from "../../lib/axios";

const ListColumn = ({ list, onTaskCreated, onTaskClick, onTaskDelete, onListDelete }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const { setNodeRef, isOver } = useDroppable({ id: list.id });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/lists/${list.id}/tasks`, { title: taskTitle });
      onTaskCreated(data);
      setTaskTitle("");
      setShowAddTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (title.trim() && title !== list.title) {
      try {
        await api.put(`/lists/${list.id}`, { title });
      } catch (error) {
        setTitle(list.title);
      }
    } else {
      setTitle(list.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-80 flex-shrink-0 bg-[#F8F6F2] border rounded-2xl flex flex-col max-h-[calc(100vh-160px)] transition-all shadow-sm ${
        isOver ? "border-[#D47E30] bg-[#FEF3E7] ring-4 ring-[#D47E30]/10" : "border-[#C9C3BB] hover:border-[#8B5E3C]"
      }`}
    >
      {/* List Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#E5E7EB] bg-white/50 rounded-t-2xl">
        {isEditingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
            className="bg-white text-[#1E293B] text-sm font-bold px-2 py-1 rounded-lg border border-[#D47E30] focus:outline-none w-full"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D47E30] flex-shrink-0" />
            <h3
              className="text-sm font-bold text-[#1E293B] cursor-pointer hover:text-[#D47E30] transition-colors truncate"
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename list"
            >
              {list.title}
            </h3>
            <span className="text-[11px] font-semibold text-[#D47E30] bg-[#FEF3E7] border border-[#D47E30]/20 px-2 py-0.5 rounded-full flex-shrink-0">
              {list.tasks.length}
            </span>
          </div>
        )}

        <button
          onClick={() => onListDelete(list.id)}
          className="text-[#94a3b8] hover:text-[#DC2626] transition-colors p-1.5 rounded-lg hover:bg-red-50 ml-2"
          title="Delete list"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Task List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[100px]">
        <SortableContext items={list.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {list.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDelete={() => onTaskDelete(task.id, list.id)}
            />
          ))}
        </SortableContext>
        {list.tasks.length === 0 && !showAddTask && (
          <div className="text-center py-8 border border-dashed border-[#C9C3BB] rounded-xl">
            <p className="text-xs font-medium text-[#94a3b8]">No tasks here yet</p>
          </div>
        )}
      </div>

      {/* Add Task Area */}
      <div className="p-3 border-t border-[#E5E7EB] bg-white/30 rounded-b-2xl">
        {showAddTask ? (
          <form onSubmit={handleAddTask} className="animate-fade-in">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm mb-2.5"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-xs font-semibold btn-glow rounded-lg disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Task"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTask(false);
                  setTaskTitle("");
                }}
                className="px-3 py-1.5 text-xs font-medium text-[#94a3b8] hover:text-[#1E293B] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#475569] hover:text-[#D47E30] bg-white/50 hover:bg-[#FEF3E7] rounded-xl border border-[#C9C3BB] hover:border-[#D47E30]/30 transition-all"
          >
            <span className="text-sm font-bold text-[#D47E30]">+</span> Add a task
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;
