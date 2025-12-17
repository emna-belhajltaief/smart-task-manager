import { createSupabaseServer } from "@/lib/supabase/server";
import { openai } from "@/lib/openai/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();
const supabase = await createSupabaseServer();

  // 1️⃣ Generate embedding
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  // 2️⃣ Match tasks
  const { data, error } = await supabase.rpc("match_tasks", {
    query_embedding: queryEmbedding,
    match_threshold: 0.75,
    match_count: 10,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}
