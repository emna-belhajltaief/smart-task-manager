import { Card } from "@/components/ui/card";

export function TasksByStatus({ tasks }: { tasks: any[] }) {
  const stats = tasks.reduce(
    (acc: any, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">Tasks by status</h3>

      {Object.entries(stats).map(([status, count]) => (
        <div
          key={status}
          className="flex justify-between text-sm"
        >
          <span>{status}</span>
          <span>{count as number}</span>
        </div>
      ))}
    </Card>
  );
}
