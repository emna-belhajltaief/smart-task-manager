import { Card } from "@/components/ui/card";

export function StatsCards({
  stats,
  tasks,
}: {
  stats: any;
  tasks: any[];
}) {
  const completed = tasks.filter(
    (t) => t.status === "done"
  ).length;

  const overdue = tasks.filter(
    (t) =>
      t.due_date &&
      new Date(t.due_date) < new Date() &&
      t.status !== "done"
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Tasks completed
        </p>
        <p className="text-2xl font-bold">{completed}</p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Tasks overdue
        </p>
        <p className="text-2xl font-bold">{overdue}</p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Productivity score
        </p>
        <p className="text-2xl font-bold">
          {stats?.productivity_score ?? 0}%
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Current streak
        </p>
        <p className="text-2xl font-bold">
          {stats?.current_streak ?? 0} days
        </p>
      </Card>
    </div>
  );
}
