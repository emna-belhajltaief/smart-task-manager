"use client";

import { createList } from "@/lib/actions/lists.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateListDialog({ boardId }: { boardId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add List</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            await createList(formData);
          }}
          className="space-y-4"
        >
          <Input name="name" placeholder="List name" />
          <input type="hidden" name="board_id" value={boardId} />

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
