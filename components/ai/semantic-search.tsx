"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search tasks by meaning..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
      />

      {loading && <p>Searching...</p>}

      <div className="space-y-2">
        {results.map((task) => (
          <Card key={task.id} className="p-3">
            <h4 className="font-semibold">{task.title}</h4>
            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>
            <span className="text-xs">
              Similarity: {task.similarity.toFixed(2)}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
