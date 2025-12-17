"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { 
  LayoutDashboard,
  Plus, 
  LogOut, 
  Star,
  MoreHorizontal,
  Archive,
  Loader2,
  Clock,
  TrendingUp,
  Folder,
  ChevronRight,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Board } from "@/types/database.types";


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: workspaces } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      let currentWorkspaceId: string;

      if (!workspaces || workspaces.length === 0) {
        const { data: newWorkspace } = await supabase
          .from("workspaces")
          .insert({
            user_id: user.id,
            name: "My Workspace",
            description: "Default workspace"
          })
          .select()
          .single();
        
        currentWorkspaceId = newWorkspace?.id;
      } else {
        currentWorkspaceId = workspaces[0].id;
      }

      setWorkspaceId(currentWorkspaceId);

      const { data: boardsData } = await supabase
        .from("boards")
        .select("*")
        .eq("workspace_id", currentWorkspaceId)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });
      
      setBoards(boardsData || []);
      setLoading(false);
    };
    loadData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleCreateBoard = async () => {
    if (!newBoard.name.trim() || !workspaceId) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("boards")
      .insert({
        name: newBoard.name,
        description: newBoard.description || null,
        workspace_id: workspaceId,
      })
      .select()
      .single();

    if (!error && data) {
      setBoards([data, ...boards]);
      setNewBoard({ name: "", description: "" });
      setDialogOpen(false);
    }
    setCreating(false);
  };

  const handleToggleFavorite = async (boardId: string, currentValue: boolean) => {
    await supabase
      .from("boards")
      .update({ is_favorite: !currentValue })
      .eq("id", boardId);
    
    setBoards(boards.map(b => 
      b.id === boardId ? { ...b, is_favorite: !currentValue } : b
    ));
  };

  const handleArchiveBoard = async (boardId: string) => {
    await supabase
      .from("boards")
      .update({ is_archived: true })
      .eq("id", boardId);
    
    setBoards(boards.filter(b => b.id !== boardId));
  };

  const favoriteBoards = boards.filter(b => b.is_favorite);
  const filteredBoards = boards.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse-soft shadow-lg shadow-violet-500/25">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">Loading your workspace</p>
            <p className="text-xs text-slate-400 mt-1">Just a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">TaskFlow</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-violet-700 bg-violet-50 rounded-lg">
              <Folder className="w-4 h-4" />
              All Boards
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Star className="w-4 h-4" />
              Favorites
              {favoriteBoards.length > 0 && (
                <span className="ml-auto text-xs font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                  {favoriteBoards.length}
                </span>
              )}
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Clock className="w-4 h-4" />
              Recent
            </button>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Overview</p>
            <div className="space-y-2">
              <div className="px-3 py-2 bg-violet-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-violet-600">Total Boards</span>
                  <span className="text-sm font-bold text-violet-700">{boards.length}</span>
                </div>
              </div>
              <div className="px-3 py-2 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-600">Starred</span>
                  <span className="text-sm font-bold text-purple-700">{favoriteBoards.length}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {(user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">TaskFlow</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900">
              {greeting()}, {user?.user_metadata?.full_name || user?.email?.split("@")[0]} 
            </h1>
            <p className="text-slate-500 mt-1">
              Here&apos;s an overview of your projects
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-violet-200 transition-all hover:-translate-y-0.5 animate-fade-in opacity-0 stagger-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-violet-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{boards.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Boards</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-violet-200 transition-all hover:-translate-y-0.5 animate-fade-in opacity-0 stagger-2">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{favoriteBoards.length}</p>
              <p className="text-sm font-medium text-slate-600">Favorites</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-violet-200 transition-all hover:-translate-y-0.5 animate-fade-in opacity-0 stagger-3">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {boards.length > 0 ? "Active" : "--"}
              </p>
              <p className="text-sm font-medium text-slate-600">Status</p>
            </div>

            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:-translate-y-0.5 cursor-pointer animate-fade-in opacity-0 stagger-4 press-effect"
              onClick={() => setDialogOpen(true)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-lg font-bold">New Board</p>
              <p className="text-sm text-white/80 font-medium">Create a project</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Favorite Boards */}
          {favoriteBoards.length > 0 && !searchQuery && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Starred Boards</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteBoards.map((board) => (
                  <BoardCard 
                    key={board.id} 
                    board={board} 
                    onToggleFavorite={handleToggleFavorite}
                    onArchive={handleArchiveBoard}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Boards */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {searchQuery ? `Search Results (${filteredBoards.length})` : "All Boards"}
              </h2>
              <Button 
                size="sm" 
                onClick={() => setDialogOpen(true)}
                className="gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                New Board
              </Button>
            </div>

            {filteredBoards.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {searchQuery ? "No boards found" : "No boards yet"}
                </h3>
                <p className="text-slate-500 mb-4">
                  {searchQuery ? "Try a different search term" : "Create your first board to get started"}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setDialogOpen(true)}
                    className="gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Create Board
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBoards.map((board) => (
                  <BoardCard 
                    key={board.id} 
                    board={board} 
                    onToggleFavorite={handleToggleFavorite}
                    onArchive={handleArchiveBoard}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Create Board Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Board Name
              </label>
              <Input
                placeholder="e.g. Marketing Campaign"
                value={newBoard.name}
                onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                className="h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Description <span className="text-slate-400">(optional)</span>
              </label>
              <Textarea
                placeholder="What's this board about?"
                value={newBoard.description}
                onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                rows={3}
              />
            </div>
            <Button 
              className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              onClick={handleCreateBoard}
              disabled={creating || !newBoard.name.trim()}
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Board"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BoardCard({ 
  board, 
  onToggleFavorite, 
  onArchive 
}: { 
  board: Board;
  onToggleFavorite: (id: string, current: boolean) => void;
  onArchive: (id: string) => void;
}) {
  return (
    <Link href={`/dashboard/boards/${board.id}`}>
      <div className="group bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer p-5">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {board.is_favorite && (
              <Star className="w-4 h-4 text-purple-500 fill-purple-500 shrink-0" />
            )}
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
              {board.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(board.id, board.is_favorite);
              }}
              className={`p-1.5 rounded-md transition-colors ${
                board.is_favorite 
                  ? "bg-purple-100 text-purple-600" 
                  : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              }`}
            >
              <Star className={`w-4 h-4 ${board.is_favorite ? "fill-current" : ""}`} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(board.id, board.is_favorite);
                }}>
                  <Star className={`w-4 h-4 mr-2 ${board.is_favorite ? "fill-current text-purple-500" : ""}`} />
                  {board.is_favorite ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    onArchive(board.id);
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[40px]">
          {board.description || "No description"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {new Date(board.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700">
              Active
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
