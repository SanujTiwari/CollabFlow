import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityStyles = {
  LOW: "bg-gray-500/15 text-gray-300 border-gray-500/30",
  MEDIUM: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  HIGH: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  URGENT: "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20",
};

const TaskCard = ({ task, onClick, onDelete, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDragState = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`glass-card rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 group relative ${
        isDragState
          ? "opacity-90 shadow-2xl shadow-violet-500/20 ring-2 ring-violet-500 border-violet-500 rotate-2 scale-105 z-50 bg-slate-900"
          : "hover:border-violet-500/40 hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-100 group-hover:text-violet-300 transition-colors leading-snug flex-1">
          {task.title}
        </h4>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-white/5 transition-all flex-shrink-0"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 font-normal">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {task.priority && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase ${
              priorityStyles[task.priority] || priorityStyles.MEDIUM
            }`}
          >
            {task.priority}
          </span>
        )}

        {task.dueDate && (
          <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}

        {task._count?.comments > 0 && (
          <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {task._count.comments}
          </span>
        )}
      </div>

      {task.assignees?.length > 0 && (
        <div className="flex -space-x-2 mt-3 pt-2 border-t border-white/5">
          {task.assignees.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-sm"
              title={a.user.name}
            >
              <span className="text-[9px] text-white font-bold">{a.user.name.charAt(0)}</span>
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center ring-2 ring-slate-900">
              <span className="text-[9px] text-gray-300 font-bold">+{task.assignees.length - 3}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
