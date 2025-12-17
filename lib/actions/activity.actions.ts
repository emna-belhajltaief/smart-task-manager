"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function logActivity(
  entityType: "task" | "subtask" | "list" | "board",
  entityId: string,
  action: string
) {
const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    entity_type: entityType,
    entity_id: entityId,
    action,
  });
}
