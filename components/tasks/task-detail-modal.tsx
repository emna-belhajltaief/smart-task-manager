"use client";

import { updateTask } from "@/lib/actions/tasks.actions";
import { createSubtask } from "@/lib/actions/subtasks.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SubtaskItem } from "./subtask-item";

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
}: {
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {/* MAIN TASK FORM */}
        <form
          action={async (formData) => {
            const values = {
              title: formData.get("title") as string,
              description: formData.get("description") as string,
              status: formData.get("status") as string,
              priority: formData.get("priority") as string,
              due_date: formData.get("due_date") as string | null,
            };

            await updateTask(task.id, values);
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <Input name="title" defaultValue={task.title} />

          <Textarea
            name="description"
            placeholder="Description"
            defaultValue={task.description || ""}
          />

          {/* STATUS */}
          <Select name="status" defaultValue={task.status || "todo"}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          {/* PRIORITY */}
          <Select name="priority" defaultValue={task.priority || "medium"}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* DUE DATE */}
          <Input
            type="date"
            name="due_date"
            defaultValue={task.due_date?.split("T")[0]}
          />

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>

        {/* SUBTASKS */}
        <div className="space-y-2 pt-4">
          <h4 className="text-sm font-semibold">Subtasks</h4>

          {task.subtasks?.map((subtask: any) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              boardId={task.list.board_id}
            />
          ))}

          <form
            action={async (formData) => {
              await createSubtask(formData);
            }}
            className="flex gap-2"
          >
            <input type="hidden" name="task_id" value={task.id} />
            <input type="hidden" name="board_id" value={task.list.board_id} />

            <input
              name="title"
              placeholder="New subtask"
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
