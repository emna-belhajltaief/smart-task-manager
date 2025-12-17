"use client";

import { Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  position: number;
  list_id: string;
}

const PRIORITY_STYLES = {
  high: { dot: "bg-purple-600", label: "High Priority" },
  medium: { dot: "bg-violet-500", label: "Medium" },
  low: { dot: "bg-slate-400", label: "Low" },
};

export function TaskCardOverlay({ task }: { task: Task }) {
  const priority = PRIORITY_STYLES[task.priority as keyof typeof PRIORITY_STYLES] || PRIORITY_STYLES.medium;

  const formatDueDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-72 bg-white rounded-lg border border-violet-200 p-3 shadow-2xl ring-2 ring-violet-500/30 rotate-3 cursor-grabbing scale-105">
      {/* Priority Indicator */}
      {task.priority && task.priority !== "medium" && (
        <div className="flex items-center gap-1.5 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {priority.label}
          </span>
        </div>
      )}

      {/* Title */}
      <p className="text-sm text-slate-800 font-medium leading-relaxed mb-2">
        {task.title}
      </p>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Due Date */}
      {task.due_date && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">
            <Calendar className="w-3 h-3" />
            {formatDueDate(task.due_date)}
          </span>
        </div>
      )}
    </div>
  );
}
