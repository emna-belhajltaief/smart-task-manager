import Link from "next/link";
import { Star } from "lucide-react";

export function BoardsSidebar({
  boards,
}: {
  boards: {
    id: string;
    name: string;
    is_favorite: boolean;
  }[];
}) {
  return (
    <div className="space-y-1">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/boards/${board.id}`}
          className="flex items-center justify-between rounded px-2 py-1 hover:bg-muted"
        >
          <span className="truncate">{board.name}</span>
          {board.is_favorite && (
            <Star className="h-3 w-3 text-yellow-500" />
          )}
        </Link>
      ))}
    </div>
  );
}
