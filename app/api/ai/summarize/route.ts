import { NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { boardId } = await req.json();
const supabase = await createSupabaseServer();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("title, status, priority")
    .eq("board_id", boardId);

  const prompt = `
Summarize the following tasks:
${tasks
  ?.map((t) => `- ${t.title} (${t.status}, ${t.priority})`)
  .join("\n")}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const summary = completion.choices[0].message.content!;

  // Store summary on board
  await supabase
    .from("boards")
    .update({ description: summary })
    .eq("id", boardId);

  await supabase.from("ai_generations").insert({
    prompt,
    response: summary,
    tokens_used: completion.usage?.total_tokens || 0,
  });

  return NextResponse.json({ summary });
}
