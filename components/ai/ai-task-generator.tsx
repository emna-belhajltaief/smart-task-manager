"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AITaskGenerator({ listId }: { listId: string }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    await fetch("/api/ai/generate-tasks", {
      method: "POST",
      body: JSON.stringify({ prompt, listId }),
    });

    setPrompt("");
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Describe what needs to be done..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Tasks"}
      </Button>
    </div>
  );
}
