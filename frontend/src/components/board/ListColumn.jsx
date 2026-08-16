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
      className={`w-80 flex-shrink-0 bg-[#0f1422]/90 border rounded-2xl flex flex-col max-h-[calc(100vh-160px)] transition-all shadow-xl backdrop-blur-md ${
        isOver ? "border-violet-500/60 bg-violet-950/20 ring-4 ring-violet-500/10" : "border-white/10 hover:border-white/20"
      }`}
    >
      {/* List Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 bg-black/20 rounded-t-2xl">
        {isEditingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
            className="bg-gray-800 text-white text-sm font-bold px-2 py-1 rounded-lg border border-violet-500 focus:outline-none w-full"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-sm shadow-violet-500/50 flex-shrink-0" />
            <h3
              className="text-sm font-bold text-gray-200 cursor-pointer hover:text-white transition-colors truncate"
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename list"
            >
              {list.title}
            </h3>
            <span className="text-[11px] font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
              {list.tasks.length}
            </span>
          </div>
        )}
        
        <button
          onClick={() => onListDelete(list.id)}
          className="text-gray-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 ml-2"
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
          <div className="text-center py-8 border border-dashed border-white/5 rounded-xl">
            <p className="text-xs font-medium text-gray-500">No tasks here yet</p>
          </div>
        )}
      </div>

      {/* Add Task Area */}
      <div className="p-3 border-t border-white/10 bg-black/10 rounded-b-2xl">
        {showAddTask ? (
          <form onSubmit={handleAddTask} className="animate-fade-in">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-gray-900/90 border border-violet-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-2.5"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-violet-500/20 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Task"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTask(false);
                  setTaskTitle("");
                }}
                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-violet-600/20 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all"
          >
            <span className="text-sm font-bold text-violet-400">+</span> Add a task
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;
