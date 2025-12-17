"use client";

import { Star, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import {
  toggleFavorite,
  archiveBoard,
} from "@/lib/actions/boards.actions";

export function BoardHeader({
  board,
}: {
  board: {
    id: string;
    name: string;
    is_favorite: boolean;
  };
}) {
  const [name, setName] = useState(board.name);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="max-w-sm text-lg font-semibold"
      />

      <div className="flex gap-2">
        <Button
          size="icon"
          variant={board.is_favorite ? "default" : "outline"}
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              toggleFavorite(board.id, !board.is_favorite)
            )
          }
        >
          <Star className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="destructive"
          disabled={pending}
          onClick={() =>
            startTransition(() => archiveBoard(board.id))
          }
        >
          <Archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
