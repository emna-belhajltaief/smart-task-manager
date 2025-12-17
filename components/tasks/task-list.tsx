import { createTask } from "@/lib/actions/tasks.actions";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AITaskGenerator } from "@/components/ai/ai-task-generator";

export function TaskList({
  list,
  boardId,
}: {
  list: any;
  boardId: string;
}) {
  return (
    <div className="w-72 bg-muted rounded-lg p-3 space-y-3">
      <h3 className="font-semibold">{list.name}</h3>

      {list.tasks?.map((task: any) => (
        <TaskCard key={task.id} task={task} />
      ))}

      <AITaskGenerator listId={list.id} />

      <form
        action={async (formData) => {
          const title = formData.get("title") as string;

          if (!title) return;

          await createTask({
            title,
            list_id: list.id,
          });
        }}
        className="space-y-2"
      >
        <Input name="title" placeholder="New task" />

        <Button size="sm" className="w-full">
          Add Task
        </Button>
      </form>
    </div>
  );
}
