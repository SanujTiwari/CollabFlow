import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityStyles = {
  LOW: "bg-gray-100 text-gray-600 border-gray-200",
  MEDIUM: "bg-blue-50 text-blue-600 border-blue-200",
  HIGH: "bg-amber-50 text-amber-600 border-amber-200",
  URGENT: "bg-red-50 text-red-600 border-red-200",
};

const labelColorMap = {
  Bug: "bg-red-50 text-red-600 border-red-200",
  Feature: "bg-purple-50 text-purple-600 border-purple-200",
  Design: "bg-blue-50 text-blue-600 border-blue-200",
  Backend: "bg-green-50 text-green-600 border-green-200",
  Frontend: "bg-cyan-50 text-cyan-600 border-cyan-200",
  Urgent: "bg-amber-50 text-amber-600 border-amber-200",
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

  const totalChecklist = task.checklist?.length || 0;
  const completedChecklist = task.checklist?.filter((c) => c.isCompleted)?.length || 0;

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
      className={`bg-white border rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 group relative ${
        isDragState
          ? "opacity-90 shadow-xl ring-2 ring-[#D47E30] border-[#D47E30] rotate-2 scale-105 z-50"
          : "border-[#E5E7EB] hover:border-[#D47E30]/40 hover:-translate-y-0.5 hover:shadow-sm"
      }`}
    >
      {/* Label Pills Header */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((lbl) => (
            <span
              key={lbl}
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                labelColorMap[lbl] || "bg-[#FEF3E7] text-[#D47E30] border-[#D47E30]/20"
              }`}
            >
              {lbl}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-[#1E293B] group-hover:text-[#D47E30] transition-colors leading-snug flex-1">
          {task.title}
        </h4>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 text-[#94a3b8] hover:text-[#DC2626] p-1 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-[#94a3b8] line-clamp-2 mt-1.5 font-normal">
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

        {totalChecklist > 0 && (
          <span
            className={`text-[11px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-md border ${
              completedChecklist === totalChecklist
                ? "bg-green-50 text-[#22C55E] border-green-200"
                : "bg-[#F8F6F2] text-[#475569] border-[#E5E7EB]"
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {completedChecklist}/{totalChecklist}
          </span>
        )}

        {task.dueDate && (
          <span className="text-[11px] font-medium text-[#94a3b8] flex items-center gap-1 bg-[#F8F6F2] px-2 py-0.5 rounded-md border border-[#E5E7EB]">
            <svg className="w-3 h-3 text-[#D47E30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}

        {task._count?.comments > 0 && (
          <span className="text-[11px] font-medium text-[#94a3b8] flex items-center gap-1 bg-[#F8F6F2] px-2 py-0.5 rounded-md border border-[#E5E7EB]">
            <svg className="w-3 h-3 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {task._count.comments}
          </span>
        )}
      </div>

      {task.assignees?.length > 0 && (
        <div className="flex -space-x-2 mt-3 pt-2 border-t border-[#E5E7EB]">
          {task.assignees.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="w-6 h-6 bg-[#D47E30] rounded-full flex items-center justify-center ring-2 ring-white shadow-sm"
              title={a.user?.name || "User"}
            >
              <span className="text-[9px] text-white font-bold">{a.user?.name?.charAt(0) || "U"}</span>
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 bg-[#C9C3BB] rounded-full flex items-center justify-center ring-2 ring-white">
              <span className="text-[9px] text-[#1E293B] font-bold">+{task.assignees.length - 3}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
