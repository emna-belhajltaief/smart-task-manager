"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MoreHorizontal, Plus, Trash2, GripVertical, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanCard } from "./kanban-card";

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

interface List {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
}

interface KanbanListProps {
  list: List;
  onAddTask: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
  onRefresh: () => void;
}

// Status colors based on list name - consistent violet family
const LIST_STYLES: Record<string, { dot: string; badge: string }> = {
  backlog: { dot: "bg-slate-400", badge: "bg-slate-100 text-slate-700" },
  todo: { dot: "bg-violet-500", badge: "bg-violet-100 text-violet-700" },
  "in progress": { dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
  doing: { dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
  review: { dot: "bg-indigo-500", badge: "bg-indigo-100 text-indigo-700" },
  done: { dot: "bg-violet-600", badge: "bg-violet-100 text-violet-700" },
  complete: { dot: "bg-violet-600", badge: "bg-violet-100 text-violet-700" },
};

function getListStyle(name: string) {
  const key = name.toLowerCase();
  for (const [keyword, style] of Object.entries(LIST_STYLES)) {
    if (key.includes(keyword)) return style;
  }
  return { dot: "bg-violet-500", badge: "bg-violet-100 text-violet-700" };
}

export function KanbanList({ list, onAddTask, onDeleteList, onRefresh }: KanbanListProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(list.id, newTaskTitle);
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  const listStyle = getListStyle(list.name);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`shrink-0 w-72 flex flex-col max-h-[calc(100vh-160px)] transition-all duration-200 ${
        isDragging ? "opacity-60 scale-[1.02] rotate-1" : ""
      }`}
    >
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
        {/* List Header */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 rounded transition-colors"
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className={`w-2 h-2 rounded-full ${listStyle.dot}`} />
              <h3 className="font-semibold text-slate-800 text-sm truncate">
                {list.name}
              </h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${listStyle.badge}`}>
                {list.tasks.length}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-slate-200 rounded-md transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="text-sm">
                  <Edit2 className="w-3.5 h-3.5 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 text-sm"
                  onClick={() => onDeleteList(list.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tasks Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <SortableContext
            items={list.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onRefresh={onRefresh} />
            ))}
          </SortableContext>

          {list.tasks.length === 0 && !showAddTask && (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <Plus className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-400">No tasks yet</p>
            </div>
          )}
        </div>

        {/* Add Task Section */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/30">
          {showAddTask ? (
            <div className="space-y-2">
              <Input
                autoFocus
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") {
                    setShowAddTask(false);
                    setNewTaskTitle("");
                  }
                }}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-xs h-8"
                >
                  Add Task
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTaskTitle("");
                  }}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Add Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
