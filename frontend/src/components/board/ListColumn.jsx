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
      className={`w-72 flex-shrink-0 bg-gray-900/50 border rounded-xl flex flex-col max-h-[calc(100vh-160px)] transition-colors ${
        isOver ? "border-violet-500/50 bg-violet-500/5" : "border-gray-800"
      }`}
    >
      {/* List Header */}
      <div className="px-3 py-3 flex items-center justify-between border-b border-gray-800/50">
        {isEditingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
            className="bg-gray-800 text-white text-sm font-medium px-2 py-1 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500 w-full"
            autoFocus
          />
        ) : (
          <h3
            className="text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
            onClick={() => setIsEditingTitle(true)}
          >
            {list.title}
            <span className="text-xs font-normal text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
              {list.tasks.length}
            </span>
          </h3>
        )}
        <button
          onClick={() => onListDelete(list.id)}
          className="text-gray-600 hover:text-red-400 transition-colors p-1"
          title="Delete list"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
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
      </div>

      {/* Add Task */}
      <div className="p-2 border-t border-gray-800/50">
        {showAddTask ? (
          <form onSubmit={handleAddTask}>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddTask(false); setTaskTitle(""); }}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            + Add a task
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;
