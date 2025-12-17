"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLists(boardId: string) {
const supabase = await createSupabaseServer();

  const { data, error } = await supabase
  .from("lists")
  .select("*, tasks(*, subtasks(*))")
  .eq("board_id", boardId)
  .order("position");


  if (error) throw new Error(error.message);
  return data;
}

export async function createList(formData: FormData) {
const supabase = await createSupabaseServer();

  const name = formData.get("name") as string;
  const boardId = formData.get("board_id") as string;

  if (!name || !boardId) throw new Error("Missing fields");

  const { error } = await supabase.from("lists").insert({
    name,
    board_id: boardId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/boards/${boardId}`);
}
