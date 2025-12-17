"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBoards() {
const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createBoard(formData: FormData) {
const supabase = await createSupabaseServer();

  const name = formData.get("name") as string;
  const workspaceId = formData.get("workspace_id") as string;

  if (!name || !workspaceId) {
    throw new Error("Missing fields");
  }

  const { error } = await supabase.from("boards").insert({
    name,
    workspace_id: workspaceId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function toggleFavorite(boardId: string, value: boolean) {
const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("boards")
    .update({ is_favorite: value })
    .eq("id", boardId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function archiveBoard(boardId: string) {
const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("boards")
    .update({ is_archived: true })
    .eq("id", boardId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
