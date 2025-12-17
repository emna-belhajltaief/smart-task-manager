import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[priority] || colors.medium
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  }
  return colors[status] || colors.todo
}