// "use server";

// import { createSupabaseServer } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";

// export async function updateTask(formData: FormData) {
//   const supabase = createSupabaseServer();

//   const taskId = formData.get("task_id") as string;
//   const boardId = formData.get("board_id") as string;

//   const updates = {
//     title: formData.get("title"),
//     description: formData.get("description"),
//     status: formData.get("status"),
//     priority: formData.get("priority"),
//     due_date: formData.get("due_date") || null,
//   };

//   const { error } = await supabase
//     .from("tasks")
//     .update(updates)
//     .eq("id", taskId);

//   if (error) throw new Error(error.message);

//   revalidatePath(`/boards/${boardId}`);
// }

// import { openai } from "@/lib/openai/client";
// import { createSupabaseServer } from "@/lib/supabase/server";

// export async function updateTaskEmbedding(
//   taskId: string,
//   title: string,
//   description?: string
// ) {
//   const supabase = createSupabaseServer();

//   const text = `${title} ${description ?? ""}`;

//   const embedding = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });

//   await supabase
//     .from("tasks")
//     .update({
//       embedding: embedding.data[0].embedding,
//     })
//     .eq("id", taskId);
// }

"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTask(
  taskId: string,
  values: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string | null;
  }>
) {
const supabase = await createSupabaseServer();

  await supabase.from("tasks").update(values).eq("id", taskId);

  revalidatePath("/");
}
export async function createTask(data: {
  title: string;
  list_id: string;
}) {
  const supabase = await createSupabaseServer();

  await supabase.from("tasks").insert(data);

  revalidatePath("/");
}
