"use client";

import { useState } from "react";
import { TaskDetailModal } from "./task-detail-modal";

export function TaskCard({ task }: { task: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-background p-2 rounded shadow text-sm cursor-pointer hover:bg-muted"
        onClick={() => setOpen(true)}
      >
        {task.title}
      </div>

      <TaskDetailModal
        task={task}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
