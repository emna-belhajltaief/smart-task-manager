"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function incrementCompletedTasks() {
const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.rpc("increment_completed_tasks", {
    uid: user.id,
  });
}
