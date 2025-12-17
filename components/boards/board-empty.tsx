import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoardEmpty({
  onCreateList,
}: {
  onCreateList?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
      <p className="text-muted-foreground">
        This board is empty. Create your first list.
      </p>

      {onCreateList && (
        <Button onClick={onCreateList}>
          <Plus className="mr-2 h-4 w-4" />
          Add List
        </Button>
      )}
    </div>
  );
}
