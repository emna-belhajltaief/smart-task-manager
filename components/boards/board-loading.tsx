import { Skeleton } from "@/components/ui/skeleton";

export function BoardLoading() {
  return (
    <div className="flex gap-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-72 space-y-3 bg-muted p-3 rounded-lg"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
