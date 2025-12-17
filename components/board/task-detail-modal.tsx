"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  Calendar, 
  Flag, 
  AlignLeft, 
  Loader2, 
  Trash2, 
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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

interface TaskDetailModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200", dot: "bg-slate-400" },
  { value: "medium", label: "Medium", color: "bg-violet-50 text-violet-700 border-violet-300 hover:bg-violet-100", dot: "bg-violet-500" },
  { value: "high", label: "High", color: "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100", dot: "bg-purple-600" },
];

export function TaskDetailModal({ task, open, onOpenChange, onUpdate }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.due_date?.split("T")[0] || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("tasks")
      .update({
        title,
        description: description || null,
        priority,
        due_date: dueDate || null,
      })
      .eq("id", task.id);

    setSaving(false);
    onUpdate();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("tasks").delete().eq("id", task.id);
    setDeleting(false);
    onUpdate();
    onOpenChange(false);
  };

  const hasChanges = 
    title !== task.title ||
    description !== (task.description || "") ||
    priority !== (task.priority || "medium") ||
    dueDate !== (task.due_date?.split("T")[0] || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 px-0 h-auto bg-transparent focus-visible:ring-0 placeholder:text-slate-400"
            placeholder="Task title"
          />
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <AlignLeft className="w-3.5 h-3.5" />
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="min-h-[120px] text-sm resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <Flag className="w-3.5 h-3.5" />
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    priority === p.value
                      ? `${p.color} ring-2 ring-offset-2 ring-slate-200 scale-[1.02]`
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${p.dot}`} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Due Date
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-48 text-sm"
              />
              {dueDate && (
                <button
                  onClick={() => setDueDate("")}
                  className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Task
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !title.trim() || !hasChanges}
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
