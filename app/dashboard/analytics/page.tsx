import { getUserStats } from "@/lib/actions/analytics.actions";
import { StatsCards } from "@/components/analytics/stats-card";
import { TasksByStatus } from "@/components/analytics/tasks-by-status";
import { RecentActivity } from "@/components/analytics/recent-activity";

export default async function AnalyticsPage() {
  const data = await getUserStats();

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <StatsCards stats={data.stats} tasks={data.tasks ?? []} />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TasksByStatus tasks={data.tasks ?? []} />
        <RecentActivity />
      </div>
    </div>
  );
}
