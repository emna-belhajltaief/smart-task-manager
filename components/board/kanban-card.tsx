"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, ChevronRight } from "lucide-react";
import { TaskDetailModal } from "./task-detail-modal";

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

interface KanbanCardProps {
  task: Task;
  onRefresh: () => void;
}

const PRIORITY_STYLES = {
  high: { 
    badge: "bg-purple-100 text-purple-700 border-purple-200", 
    dot: "bg-purple-600",
    label: "High Priority" 
  },
  medium: { 
    badge: "bg-violet-100 text-violet-700 border-violet-200", 
    dot: "bg-violet-500",
    label: "Medium" 
  },
  low: { 
    badge: "bg-slate-100 text-slate-600 border-slate-200", 
    dot: "bg-slate-400",
    label: "Low" 
  },
};

export function KanbanCard({ task, onRefresh }: KanbanCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITY_STYLES[task.priority as keyof typeof PRIORITY_STYLES] || PRIORITY_STYLES.medium;

  const formatDueDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    if (d < nextWeek) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const isDueToday = task.due_date && new Date(task.due_date).toDateString() === new Date().toDateString();

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setModalOpen(true)}
        className={`bg-white rounded-lg border border-slate-200 p-3 cursor-pointer transition-all group ${
          isDragging 
            ? "shadow-xl ring-2 ring-violet-500/30 opacity-95 rotate-2 scale-105" 
            : "hover:shadow-md hover:border-slate-300"
        }`}
      >
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
        <p className="text-sm text-slate-800 font-medium leading-relaxed mb-2 group-hover:text-slate-900 transition-colors">
          {task.title}
        </p>

        {/* Description Preview */}
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.due_date && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
                  isOverdue 
                    ? "bg-purple-100 text-purple-700" 
                    : isDueToday
                    ? "bg-violet-100 text-violet-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(task.due_date)}
              </span>
            )}
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      <TaskDetailModal
        task={task}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={onRefresh}
      />
    </>
  );
}
