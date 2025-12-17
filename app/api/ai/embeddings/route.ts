import { openai } from "@/lib/openai/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return NextResponse.json({
    embedding: embedding.data[0].embedding,
  });
}
