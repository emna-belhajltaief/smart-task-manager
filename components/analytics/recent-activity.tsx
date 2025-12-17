import { createSupabaseServer } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export async function RecentActivity() {
const supabase = await createSupabaseServer();

  const { data: logs } = await supabase
    .from("activity_logs")
    .select("action, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Recent activity</h3>

      {logs?.map((log) => (
        <div
          key={log.created_at}
          className="text-sm text-muted-foreground"
        >
          {log.action}
        </div>
      ))}
    </Card>
  );
}
