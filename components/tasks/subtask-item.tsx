"use client";

import { toggleSubtask } from "@/lib/actions/subtasks.actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransition } from "react";

export function SubtaskItem({
  subtask,
  boardId,
}: {
  subtask: any;
  boardId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={subtask.is_completed}
        disabled={pending}
        onCheckedChange={(value: boolean) =>
          startTransition(() =>
            toggleSubtask(subtask.id, Boolean(value), boardId)
          )
        }
      />
      <span className={subtask.is_completed ? "line-through opacity-60" : ""}>
        {subtask.title}
      </span>
    </div>
  );
}
