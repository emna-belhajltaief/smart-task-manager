import { NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { prompt, listId } = await req.json();
const supabase = await createSupabaseServer();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a task planner. Return a JSON array of task titles.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0].message.content!;
  const tasks: string[] = JSON.parse(content);

  // Insert tasks
  const inserts = tasks.map((title) => ({
    title,
    list_id: listId,
    is_ai_generated: true,
  }));

  await supabase.from("tasks").insert(inserts);

  // Save AI generation
  await supabase.from("ai_generations").insert({
    prompt,
    response: content,
    tokens_used: completion.usage?.total_tokens || 0,
  });

  return NextResponse.json({ success: true });
}
