"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSubtask(formData: FormData) {
const supabase = await createSupabaseServer();

  const title = formData.get("title") as string;
  const taskId = formData.get("task_id") as string;
  const boardId = formData.get("board_id") as string;

  if (!title || !taskId) throw new Error("Missing fields");

  const { error } = await supabase.from("subtasks").insert({
    title,
    task_id: taskId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/boards/${boardId}`);
}

export async function toggleSubtask(subtaskId: string, completed: boolean, boardId: string) {
const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("subtasks")
    .update({ is_completed: completed })
    .eq("id", subtaskId);

  if (error) throw new Error(error.message);

  revalidatePath(`/boards/${boardId}`);
}
