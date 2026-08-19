import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import api from "../lib/axios";
import ListColumn from "../components/board/ListColumn";
import TaskCard from "../components/board/TaskCard";
import AddListForm from "../components/board/AddListForm";
import TaskModal from "../components/board/TaskModal";
import TextLoader from "../components/common/TextLoader";
import { io as socketIO } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const boardThemes = [
  { id: "cream", name: "Cream", bg: "bg-[#DFDBD4]" },
  { id: "warm", name: "Warm Sand", bg: "bg-gradient-to-br from-[#DFDBD4] via-[#E8E2D8] to-[#DFDBD4]" },
  { id: "sage", name: "Sage", bg: "bg-gradient-to-br from-[#DFDBD4] via-[#D5DDD5] to-[#DFDBD4]" },
  { id: "sky", name: "Soft Sky", bg: "bg-gradient-to-br from-[#DFDBD4] via-[#D5DFEA] to-[#DFDBD4]" },
];

const BoardView = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedLabel, setSelectedLabel] = useState("ALL");
  const [activeTheme, setActiveTheme] = useState(boardThemes[0]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportBoardCSV = () => {
    if (!board) return;
    const rows = [["Board Title", "Column", "Task Title", "Description", "Priority", "Due Date", "Labels", "Assignees"]];
    board.lists.forEach((list) => {
      list.tasks.forEach((task) => {
        rows.push([
          `"${board.title}"`,
          `"${list.title}"`,
          `"${task.title.replace(/"/g, '""')}"`,
          `"${(task.description || "").replace(/"/g, '""')}"`,
          `"${task.priority}"`,
          `"${task.dueDate ? task.dueDate.split("T")[0] : ""}"`,
          `"${(task.labels || []).join(", ")}"`,
          `"${(task.assignees || []).map((a) => a.user?.name).join(", ")}"`,
        ]);
      });
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${board.title.replace(/\s+/g, "_")}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const exportBoardJSON = () => {
    if (!board) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(board, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${board.title.replace(/\s+/g, "_")}_Export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportMenu(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchBoard = useCallback(async () => {
    try {
      const { data } = await api.get(`/boards/${boardId}`);
      setBoard(data);
    } catch (error) {
      console.error("Failed to fetch board:", error);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Socket.IO real-time with deduplication to prevent duplicate cards/lists!
  useEffect(() => {
    const socket = socketIO(SOCKET_URL);
    socket.emit("joinBoard", boardId);

    socket.on("list:created", (newList) => {
      setBoard((prev) => {
        if (!prev) return prev;
        if (prev.lists.some((l) => l.id === newList.id)) return prev;
        return { ...prev, lists: [...prev.lists, { ...newList, tasks: newList.tasks || [] }] };
      });
    });

    socket.on("list:updated", (updatedList) => {
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              lists: prev.lists.map((l) => (l.id === updatedList.id ? { ...l, ...updatedList } : l)),
            }
          : prev
      );
    });

    socket.on("list:deleted", ({ listId }) => {
      setBoard((prev) =>
        prev ? { ...prev, lists: prev.lists.filter((l) => l.id !== listId) } : prev
      );
    });

    socket.on("task:created", (newTask) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map((l) => {
            if (l.id !== newTask.listId) return l;
            if (l.tasks.some((t) => t.id === newTask.id)) return l;
            return { ...l, tasks: [...l.tasks, newTask] };
          }),
        };
      });
    });

    socket.on("task:updated", (updatedTask) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map((l) => ({
            ...l,
            tasks: l.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
          })),
        };
      });
    });

    socket.on("task:deleted", ({ taskId, listId }) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map((l) =>
            l.id === listId ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) } : l
          ),
        };
      });
    });

    socket.on("task:moved", () => {
      fetchBoard();
    });

    return () => {
      socket.emit("leaveBoard", boardId);
      socket.disconnect();
    };
  }, [boardId, fetchBoard]);

  const findTaskAndList = (taskId) => {
    if (!board) return null;
    for (const list of board.lists) {
      const task = list.tasks.find((t) => t.id === taskId);
      if (task) return { task, list };
    }
    return null;
  };

  const handleDragStart = (event) => {
    const result = findTaskAndList(event.active.id);
    if (result) setActiveTask(result.task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || !board) return;

    const activeResult = findTaskAndList(active.id);
    if (!activeResult) return;

    let destinationListId = over.id;
    let newPosition = 0;

    const overResult = findTaskAndList(over.id);
    if (overResult) {
      destinationListId = overResult.list.id;
      newPosition = overResult.list.tasks.findIndex((t) => t.id === over.id);
    } else {
      const destList = board.lists.find((l) => l.id === over.id);
      if (destList) {
        newPosition = destList.tasks.length;
      }
    }

    const sourceListId = activeResult.list.id;

    if (sourceListId === destinationListId && activeResult.task.position === newPosition) {
      return;
    }

    // Optimistic update
    setBoard((prev) => {
      if (!prev) return prev;
      const newLists = prev.lists.map((l) => ({
        ...l,
        tasks: l.tasks.filter((t) => t.id !== active.id),
      }));

      return {
        ...prev,
        lists: newLists.map((l) => {
          if (l.id === destinationListId) {
            const newTasks = [...l.tasks];
            newTasks.splice(newPosition, 0, {
              ...activeResult.task,
              listId: destinationListId,
              position: newPosition,
            });
            return { ...l, tasks: newTasks };
          }
          return l;
        }),
      };
    });

    try {
      await api.put("/tasks/reorder", {
        taskId: active.id,
        sourceListId,
        destinationListId,
        newPosition,
      });
    } catch (error) {
      console.error("Failed to reorder:", error);
      fetchBoard();
    }
  };

  const handleListCreated = (newList) => {
    setBoard((prev) => {
      if (!prev) return prev;
      if (prev.lists.some((l) => l.id === newList.id)) return prev;
      return { ...prev, lists: [...prev.lists, { ...newList, tasks: newList.tasks || [] }] };
    });
  };

  const handleListDeleted = async (listId) => {
    setBoard((prev) =>
      prev ? { ...prev, lists: prev.lists.filter((l) => l.id !== listId) } : prev
    );
    try {
      await api.delete(`/lists/${listId}`);
    } catch (error) {
      console.error("Failed to delete list:", error);
      fetchBoard();
    }
  };

  const handleTaskCreated = (newTask) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((l) => {
          if (l.id !== newTask.listId) return l;
          if (l.tasks.some((t) => t.id === newTask.id)) return l;
          return { ...l, tasks: [...l.tasks, newTask] };
        }),
      };
    });
  };

  const handleTaskDeleted = async (taskId, listId) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((l) =>
          l.id === listId ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) } : l
        ),
      };
    });
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Failed to delete task:", error);
      fetchBoard();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] py-20">
        <TextLoader text="COLLABFLOW" variant="amber" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <p className="text-[#94a3b8] font-medium">Board not found or access denied</p>
      </div>
    );
  }

  // Filter tasks based on Search Query, Priority, and Label
  const filterTask = (task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      selectedPriority === "ALL" || task.priority === selectedPriority;
    const matchesLabel =
      selectedLabel === "ALL" || (task.labels && task.labels.includes(selectedLabel));
    return matchesSearch && matchesPriority && matchesLabel;
  };

  return (
    <div className={`h-full flex flex-col ${activeTheme.bg} transition-colors duration-500`}>
      {/* Board Header Bar */}
      <div className="px-6 py-4 border-b border-[#C9C3BB] bg-white flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-gradient-to-b from-[#D47E30] to-[#8B5E3C] rounded-full" />
          <div>
            <h1 className="text-xl font-extrabold text-[#1E293B] tracking-tight">{board.title}</h1>
            <p className="text-xs text-[#94a3b8] font-medium">
              {board.lists.length} columns • {board.lists.reduce((acc, l) => acc + l.tasks.length, 0)} total tasks
            </p>
          </div>
        </div>

        {/* Filter Controls, Export & Search */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs transition-all w-44 focus:w-56"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-[#F8F6F2] p-1 rounded-xl border border-[#C9C3BB]">
            {["ALL", "HIGH", "URGENT"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedPriority === p
                    ? "bg-[#D47E30] text-white shadow-sm"
                    : "text-[#94a3b8] hover:text-[#1E293B] hover:bg-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Label Tag Filter */}
          <div className="flex items-center gap-1 bg-[#F8F6F2] p-1 rounded-xl border border-[#C9C3BB]">
            {["ALL", "Bug", "Feature", "Design", "Backend"].map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLabel(l)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedLabel === l
                    ? "bg-[#8B5E3C] text-white shadow-sm"
                    : "text-[#94a3b8] hover:text-[#1E293B] hover:bg-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 text-xs font-bold text-[#475569] bg-[#F8F6F2] hover:bg-[#DFDBD4] border border-[#C9C3BB] rounded-xl transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-[#C9C3BB] rounded-xl shadow-lg z-50 p-1">
                <button
                  onClick={exportBoardCSV}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#475569] hover:bg-[#FEF3E7] hover:text-[#D47E30] rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="text-[#22C55E] font-mono text-[10px]">.CSV</span>
                  Export CSV
                </button>
                <button
                  onClick={exportBoardJSON}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#475569] hover:bg-[#FEF3E7] hover:text-[#D47E30] rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="text-[#D47E30] font-mono text-[10px]">.JSON</span>
                  Export JSON
                </button>
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1">
            {boardThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t)}
                title={t.name}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  activeTheme.id === t.id ? "scale-125 border-[#1E293B] ring-2 ring-[#D47E30]/50" : "border-transparent opacity-70 hover:opacity-100"
                } ${t.id === "cream" ? "bg-[#DFDBD4]" : t.id === "warm" ? "bg-[#E8DDD0]" : t.id === "sage" ? "bg-[#C5D5C5]" : "bg-[#C5D5E5]"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 h-full items-start">
            {board.lists.map((list) => {
              const filteredTasks = list.tasks.filter(filterTask);
              return (
                <ListColumn
                  key={list.id}
                  list={{ ...list, tasks: filteredTasks }}
                  onTaskCreated={handleTaskCreated}
                  onTaskClick={(task) => setSelectedTask(task)}
                  onTaskDelete={handleTaskDeleted}
                  onListDelete={handleListDeleted}
                />
              );
            })}
            <AddListForm boardId={boardId} onCreated={handleListCreated} />
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          taskId={selectedTask.id}
          onClose={() => setSelectedTask(null)}
          onUpdated={(updatedTask) => {
            setBoard((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                lists: prev.lists.map((l) => ({
                  ...l,
                  tasks: l.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
                })),
              };
            });
            setSelectedTask(null);
          }}
          onDeleted={(taskId) => {
            setBoard((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                lists: prev.lists.map((l) => ({
                  ...l,
                  tasks: l.tasks.filter((t) => t.id !== taskId),
                })),
              };
            });
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default BoardView;
