"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableList } from "@/components/tasks/sortable-list";
import { TaskList } from "@/components/tasks/task-list";
import { reorderLists } from "@/lib/actions/dnd.actions";

export default function BoardClient({
  boardId,
  lists,
}: {
  boardId: string;
  lists: any[];
}) {
  const handleDragEnd = async (_: DragEndEvent) => {
    const items = lists.map((l, index) => ({
      id: l.id,
      position: index,
    }));

    await reorderLists(boardId, items);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-4">
          {lists.map((list) => (
            <SortableList key={list.id} id={list.id}>
              <TaskList list={list} boardId={boardId} />
            </SortableList>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
