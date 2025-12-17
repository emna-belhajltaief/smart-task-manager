import { Button } from "@/components/ui/button";

export function BoardsEmptyDashboard() {
  return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-xl font-semibold">
        No boards yet
      </h2>
      <p className="text-muted-foreground">
        Create a board to start organizing your tasks.
      </p>
      <Button>Create your first board</Button>
    </div>
  );
}
