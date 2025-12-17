"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function reorderLists(
  boardId: string,
  items: { id: string; position: number }[]
) {
const supabase = await createSupabaseServer();

  const updates = items.map((i) =>
    supabase.from("lists").update({ position: i.position }).eq("id", i.id)
  );

  await Promise.all(updates);
  revalidatePath(`/boards/${boardId}`);
}

export async function moveTask({
  taskId,
  toListId,
  position,
  boardId,
}: {
  taskId: string;
  toListId: string;
  position: number;
  boardId: string;
}) {
const supabase = await createSupabaseServer();

  await supabase
    .from("tasks")
    .update({ list_id: toListId, position })
    .eq("id", taskId);

  revalidatePath(`/boards/${boardId}`);
}
