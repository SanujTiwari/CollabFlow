import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import api from "../lib/axios";
import ListColumn from "../components/board/ListColumn";
import TaskCard from "../components/board/TaskCard";
import AddListForm from "../components/board/AddListForm";
import TaskModal from "../components/board/TaskModal";
import { io as socketIO } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const BoardView = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

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

  // Socket.IO for real-time
  useEffect(() => {
    const socket = socketIO(SOCKET_URL);
    socket.emit("joinBoard", boardId);

    socket.on("list:created", (list) => {
      setBoard((prev) => prev ? { ...prev, lists: [...prev.lists, { ...list, tasks: list.tasks || [] }] } : prev);
    });

    socket.on("list:updated", (updatedList) => {
      setBoard((prev) => prev ? {
        ...prev,
        lists: prev.lists.map((l) => (l.id === updatedList.id ? { ...l, ...updatedList } : l)),
      } : prev);
    });

    socket.on("list:deleted", ({ listId }) => {
      setBoard((prev) => prev ? { ...prev, lists: prev.lists.filter((l) => l.id !== listId) } : prev);
    });

    socket.on("task:created", (task) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map((l) =>
            l.id === task.listId ? { ...l, tasks: [...l.tasks, task] } : l
          ),
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
      fetchBoard(); // Refetch to get correct positions
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

    // Determine destination list
    let destinationListId = over.id;
    let newPosition = 0;

    // If dropping over a task, find its list
    const overResult = findTaskAndList(over.id);
    if (overResult) {
      destinationListId = overResult.list.id;
      newPosition = overResult.list.tasks.findIndex((t) => t.id === over.id);
    } else {
      // Dropping over a list directly
      const destList = board.lists.find((l) => l.id === over.id);
      if (destList) {
        newPosition = destList.tasks.length;
      }
    }

    const sourceListId = activeResult.list.id;

    if (sourceListId === destinationListId && activeResult.task.position === newPosition) {
      return; // No change
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
            newTasks.splice(newPosition, 0, { ...activeResult.task, listId: destinationListId, position: newPosition });
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
      fetchBoard(); // Rollback
    }
  };

  const handleListCreated = (list) => {
    setBoard((prev) =>
      prev ? { ...prev, lists: [...prev.lists, { ...list, tasks: list.tasks || [] }] } : prev
    );
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

  const handleTaskCreated = (task) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((l) =>
          l.id === task.listId ? { ...l, tasks: [...l.tasks, task] } : l
        ),
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
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Board not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white">{board.title}</h2>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 h-full items-start">
            {board.lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                onTaskCreated={handleTaskCreated}
                onTaskClick={(task) => setSelectedTask(task)}
                onTaskDelete={handleTaskDeleted}
                onListDelete={handleListDeleted}
              />
            ))}
            <AddListForm boardId={boardId} onCreated={handleListCreated} />
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

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
