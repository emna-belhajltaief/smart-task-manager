"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { reorderLists, moveTask } from "@/lib/actions/dnd.actions";
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  LayoutDashboard, 
  Star,
  MoreHorizontal,
  Folder,
  Clock,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KanbanList } from "@/components/board/kanban-list";
import { TaskCardOverlay } from "@/components/board/task-card-overlay";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  position: number;
  list_id: string;
}

interface List {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
}

interface Board {
  id: string;
  name: string;
  description?: string;
  is_favorite?: boolean;
}

// Color palette matching dashboard - consistent violet/purple family
const BOARD_COLORS = [
  { gradient: "from-violet-500 to-violet-600", light: "bg-violet-500/10" },
  { gradient: "from-purple-500 to-purple-600", light: "bg-purple-500/10" },
  { gradient: "from-indigo-500 to-indigo-600", light: "bg-indigo-500/10" },
  { gradient: "from-violet-600 to-purple-700", light: "bg-violet-500/10" },
  { gradient: "from-purple-600 to-indigo-600", light: "bg-purple-500/10" },
  { gradient: "from-indigo-600 to-violet-600", light: "bg-indigo-500/10" },
];

function getColorForBoard(id: string) {
  const index = id.charCodeAt(0) % BOARD_COLORS.length;
  return BOARD_COLORS[index];
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const boardColor = board ? getColorForBoard(board.id) : BOARD_COLORS[0];

  const loadBoard = useCallback(async () => {
    const { data: boardData } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    setBoard(boardData);

    const { data: listsData } = await supabase
      .from("lists")
      .select(`*, tasks (*)`)
      .eq("board_id", boardId)
      .order("position", { ascending: true });

    const sortedLists = (listsData || []).map((list: List & { tasks?: Task[] }) => ({
      ...list,
      tasks: (list.tasks || []).sort((a: Task, b: Task) => a.position - b.position),
    }));

    setLists(sortedLists);
    setLoading(false);
  }, [boardId, supabase]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    for (const list of lists) {
      const task = list.tasks.find((t) => t.id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeListIndex = lists.findIndex((l) => l.id === activeId);
    const overListIndex = lists.findIndex((l) => l.id === overId);

    if (activeListIndex !== -1 && overListIndex !== -1) {
      const newLists = arrayMove(lists, activeListIndex, overListIndex);
      setLists(newLists);
      
      const items = newLists.map((l, index) => ({
      id: l.id,
      position: index,
    }));
      await reorderLists(boardId, items);
      return;
    }

    let sourceList: List | undefined;
    let destList: List | undefined;
    let taskIndex = -1;

    for (const list of lists) {
      const idx = list.tasks.findIndex((t) => t.id === activeId);
      if (idx !== -1) {
        sourceList = list;
        taskIndex = idx;
        break;
      }
    }

    destList = lists.find((l) => l.id === overId);
    if (!destList) {
      for (const list of lists) {
        if (list.tasks.find((t) => t.id === overId)) {
          destList = list;
          break;
        }
      }
    }

    if (sourceList && destList && taskIndex !== -1) {
      const task = sourceList.tasks[taskIndex];
      
      const newLists = lists.map((list) => {
        if (list.id === sourceList!.id) {
          return {
            ...list,
            tasks: list.tasks.filter((t) => t.id !== activeId),
          };
        }
        if (list.id === destList!.id) {
          return {
            ...list,
            tasks: [...list.tasks.filter((t) => t.id !== activeId), { ...task, list_id: destList!.id }],
          };
        }
        return list;
      });

      setLists(newLists);
      
      if (sourceList.id !== destList.id) {
        await moveTask({
          taskId: activeId,
          toListId: destList.id,
          position: destList.tasks.length,
          boardId,
        });
      }
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    setAddingList(true);

    const { data } = await supabase
      .from("lists")
      .insert({
        board_id: boardId,
        name: newListName,
        position: lists.length,
      })
      .select()
      .single();

    if (data) {
      setLists([...lists, { ...data, tasks: [] }]);
      setNewListName("");
      setShowAddList(false);
    }
    setAddingList(false);
  };

  const handleDeleteList = async (listId: string) => {
    await supabase.from("lists").delete().eq("id", listId);
    setLists(lists.filter((l) => l.id !== listId));
  };

  const handleAddTask = async (listId: string, title: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const { data } = await supabase
      .from("tasks")
      .insert({
        list_id: listId,
        title,
        position: list.tasks.length,
        status: "todo",
        priority: "medium",
      })
      .select()
      .single();

    if (data) {
      setLists(
        lists.map((l) =>
          l.id === listId ? { ...l, tasks: [...l.tasks, data] } : l
        )
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (!board) return;
    await supabase
      .from("boards")
      .update({ is_favorite: !board.is_favorite })
      .eq("id", boardId);
    setBoard({ ...board, is_favorite: !board.is_favorite });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const totalTasks = lists.reduce((acc, l) => acc + l.tasks.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse-soft shadow-lg shadow-violet-500/25">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">Loading your board</p>
            <p className="text-xs text-slate-400 mt-1">Getting everything ready...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">TaskFlow</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            <Link 
              href="/dashboard"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Folder className="w-4 h-4" />
              All Boards
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Star className="w-4 h-4" />
              Favorites
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Clock className="w-4 h-4" />
              Recent
            </Link>
          </div>

          {/* Current Board */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Current Board</p>
            <div className="px-3 py-3 bg-violet-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded bg-gradient-to-br ${boardColor.gradient} flex items-center justify-center text-white text-xs font-semibold`}>
                  {board?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-violet-900 truncate">{board?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-violet-600">
                <span>{lists.length} lists</span>
                <span>·</span>
                <span>{totalTasks} tasks</span>
              </div>
            </div>
          </div>

          {/* Board Stats */}
          <div className="mt-4 space-y-2">
            {lists.map((list) => (
              <div key={list.id} className="px-3 py-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 truncate">{list.name}</span>
                  <span className="text-xs font-medium text-slate-900">{list.tasks.length}</span>
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile back button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${boardColor.gradient} flex items-center justify-center text-white text-sm font-semibold`}>
                {board?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-900">
                  {board?.name}
                </h1>
                {board?.description && (
                  <p className="text-xs text-slate-500 truncate max-w-[300px] hidden sm:block">
                    {board.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stats Badge */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-100 rounded-lg">
              <span className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{lists.length}</span> lists
              </span>
              <div className="w-px h-3 bg-slate-300" />
              <span className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{totalTasks}</span> tasks
              </span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                board?.is_favorite 
                  ? "bg-purple-100 text-purple-600" 
                  : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              }`}
            >
              <Star className={`w-4 h-4 ${board?.is_favorite ? "fill-current" : ""}`} />
            </button>

            {/* More Options */}
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Board Canvas */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full p-4 lg:p-6">
    <DndContext
              sensors={sensors}
      collisionDetection={closestCenter}
              onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
                <div className="flex gap-4 h-full items-start pb-4">
          {lists.map((list) => (
                    <KanbanList
                      key={list.id}
                      list={list}
                      onAddTask={handleAddTask}
                      onDeleteList={handleDeleteList}
                      onRefresh={loadBoard}
                    />
                  ))}

                  {/* Add List Card */}
                  <div className="shrink-0 w-72">
                    {showAddList ? (
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <Input
                          autoFocus
                          placeholder="Enter list name..."
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddList();
                            if (e.key === "Escape") {
                              setShowAddList(false);
                              setNewListName("");
                            }
                          }}
                          className="mb-3"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAddList}
                            disabled={addingList || !newListName.trim()}
                            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                          >
                            {addingList ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Add List"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowAddList(false);
                              setNewListName("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddList(true)}
                        className="w-full h-12 rounded-xl border-2 border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium group"
                      >
                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Add List
                      </button>
                    )}
                  </div>
        </div>
      </SortableContext>

              <DragOverlay>
                {activeTask && <TaskCardOverlay task={activeTask} />}
              </DragOverlay>
    </DndContext>

            {/* Empty State */}
            {lists.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard className="w-8 h-8 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    No lists yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Create your first list to start organizing tasks
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
