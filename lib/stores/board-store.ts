import { create } from 'zustand'

type Task = {
  id: string
  list_id: string
  title: string
  description?: string
  position: number
  priority: string
  status: string
  due_date?: string
  tags: string[]
  created_at: string
}

type List = {
  id: string
  board_id: string
  name: string
  position: number
  tasks?: Task[]
}

type BoardStore = {
  lists: List[]
  setLists: (lists: List[]) => void
  addList: (list: List) => void
  updateList: (id: string, updates: Partial<List>) => void
  deleteList: (id: string) => void
  addTask: (listId: string, task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, targetListId: string, newPosition: number) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  lists: [],
  
  setLists: (lists) => set({ lists }),
  
  addList: (list) => set((state) => ({ 
    lists: [...state.lists, list] 
  })),
  
  updateList: (id, updates) => set((state) => ({
    lists: state.lists.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  
  deleteList: (id) => set((state) => ({
    lists: state.lists.filter(l => l.id !== id)
  })),
  
  addTask: (listId, task) => set((state) => ({
    lists: state.lists.map(l => 
      l.id === listId 
        ? { ...l, tasks: [...(l.tasks || []), task] }
        : l
    )
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    lists: state.lists.map(l => ({
      ...l,
      tasks: l.tasks?.map(t => t.id === taskId ? { ...t, ...updates } : t)
    }))
  })),
  
  deleteTask: (taskId) => set((state) => ({
    lists: state.lists.map(l => ({
      ...l,
      tasks: l.tasks?.filter(t => t.id !== taskId)
    }))
  })),
  
  moveTask: (taskId, targetListId, newPosition) => set((state) => {
    // Retirer la tâche de toutes les listes
    const sourceLists = state.lists.map(l => ({
      ...l,
      tasks: l.tasks?.filter(t => t.id !== taskId) || []
    }))
    
    // Trouver la tâche
    const task = state.lists
      .flatMap(l => l.tasks || [])
      .find(t => t.id === taskId)
    
    if (!task) return state
    
    // Ajouter la tâche à la liste cible
    return {
      lists: sourceLists.map(l => 
        l.id === targetListId
          ? {
              ...l,
              tasks: [
                ...(l.tasks || []).slice(0, newPosition),
                { ...task, list_id: targetListId, position: newPosition },
                ...(l.tasks || []).slice(newPosition)
              ]
            }
          : l
      )
    }
  }),
}))