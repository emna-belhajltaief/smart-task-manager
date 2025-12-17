"use client";

import { Board } from "@/types/database.types";
import { toggleFavorite, archiveBoard } from "@/lib/actions/boards.actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Archive } from "lucide-react";
import { useTransition } from "react";
import Link from "next/link";

export function BoardCard({ board }: { board: Board }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="p-4 space-y-3">
      <Link href={`/boards/${board.id}`}>
        <h3 className="font-semibold text-lg hover:underline">
          {board.name}
        </h3>
      </Link>

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
          variant="outline"
          disabled={pending}
          onClick={() =>
            startTransition(() => archiveBoard(board.id))
          }
        >
          <Archive className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
