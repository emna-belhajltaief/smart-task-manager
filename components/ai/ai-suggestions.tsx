"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AISuggestions({ boardId }: { boardId: string }) {
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    setLoading(true);
    await fetch("/api/ai/summarize", {
      method: "POST",
      body: JSON.stringify({ boardId }),
    });
    setLoading(false);
  };

  return (
    <Button variant="outline" onClick={summarize} disabled={loading}>
      {loading ? "Summarizing..." : "AI Summary"}
    </Button>
  );
}
