"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getUserStats() {
const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("status, priority, due_date, completed_at");

  return { stats, tasks };
}
