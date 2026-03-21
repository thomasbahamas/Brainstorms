"use client"

import { useAppStore, Task } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Flame,
  Tag,
  Calendar,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const PRIORITY_CONFIG = {
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: Flame },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: AlertTriangle },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Clock },
  low: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30", icon: Circle },
}

const STATUS_COLUMNS = [
  { key: "todo" as const, label: "To Do", gradient: "from-gray-500 to-gray-600" },
  { key: "in-progress" as const, label: "In Progress", gradient: "from-blue-500 to-cyan-500" },
  { key: "done" as const, label: "Done", gradient: "from-green-500 to-emerald-500" },
]

function TaskCard({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useAppStore()
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    dueDate: task.dueDate || "",
  })
  const priority = PRIORITY_CONFIG[task.priority]
  const PriorityIcon = priority.icon

  const cycleStatus = () => {
    const next = task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo"
    updateTask(task.id, { status: next })
    if (next === "done") toast("Task completed!")
  }

  const handleSave = () => {
    if (!editData.title.trim()) {
      toast("Title is required", "error")
      return
    }
    updateTask(task.id, {
      title: editData.title,
      description: editData.description || undefined,
      priority: editData.priority,
      dueDate: editData.dueDate || undefined,
    })
    setEditing(false)
    toast("Task updated")
  }

  const handleDelete = () => {
    deleteTask(task.id)
    toast("Task deleted")
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-purple-500/30 bg-gray-900/80 p-3 space-y-2">
        <input
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white outline-none focus:border-purple-500"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          placeholder="Description (optional)"
          rows={2}
          className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none resize-none"
        />
        <div className="flex gap-2">
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value as Task["priority"] })}
            className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white outline-none"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            className="flex-1 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          <button onClick={handleSave} className="flex items-center gap-1 rounded bg-purple-600 px-2.5 py-1 text-xs text-white hover:bg-purple-500">
            <Save className="h-3 w-3" /> Save
          </button>
          <button onClick={() => setEditing(false)} className="rounded border border-gray-700 px-2.5 py-1 text-xs text-gray-400 hover:text-white">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group rounded-lg border bg-gray-900/80 p-3 transition-all hover:border-gray-600",
        priority.border
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <button onClick={cycleStatus} className="mt-0.5 shrink-0">
          {task.status === "done" ? (
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          ) : task.status === "in-progress" ? (
            <Clock className="h-4 w-4 text-blue-400 animate-pulse" />
          ) : (
            <Circle className="h-4 w-4 text-gray-600 hover:text-gray-400" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium leading-tight",
              task.status === "done" ? "text-gray-500 line-through" : "text-white"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => { setEditData({ title: task.title, description: task.description || "", priority: task.priority, dueDate: task.dueDate || "" }); setEditing(true) }} className="rounded p-1 text-gray-500 hover:text-purple-400">
            <Pencil className="h-3 w-3" />
          </button>
          <button onClick={handleDelete} className="rounded p-1 text-gray-500 hover:text-red-400">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase", priority.bg, priority.color)}>
          <PriorityIcon className="h-3 w-3" />
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <Calendar className="h-3 w-3" />
            {task.dueDate}
          </span>
        )}
        {task.module && (
          <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-400">
            {task.module}
          </span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="mt-2 flex items-center gap-1 flex-wrap">
          <Tag className="h-3 w-3 text-gray-600" />
          {task.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-gray-500">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function TaskBoard() {
  const { tasks, addTask } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium")
  const [newDueDate, setNewDueDate] = useState("")

  const handleAdd = () => {
    if (!newTitle.trim()) {
      toast("Enter a task title", "error")
      return
    }
    addTask({
      id: `t${Date.now()}`,
      title: newTitle,
      status: "todo",
      priority: newPriority,
      dueDate: newDueDate || undefined,
      tags: [],
      createdAt: new Date().toISOString().split("T")[0],
    })
    toast("Task added")
    setNewTitle("")
    setNewPriority("medium")
    setNewDueDate("")
    setShowAdd(false)
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: tasks.length, color: "text-white" },
          { label: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "text-blue-400" },
          { label: "Critical", value: tasks.filter((t) => t.priority === "critical" && t.status !== "done").length, color: "text-red-400" },
          { label: "Done", value: tasks.filter((t) => t.status === "done").length, color: "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Add Task */}
      <div>
        {showAdd ? (
          <div className="space-y-2 rounded-xl border border-gray-700 bg-gray-900/80 p-3">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500"
            />
            <div className="flex gap-2">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
                className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-1.5 text-xs text-white outline-none"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="Due date"
                className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-2 py-1.5 text-xs text-white outline-none"
              />
              <button onClick={handleAdd} className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-purple-500">
                Add
              </button>
              <button onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-2.5 text-sm text-gray-500 transition hover:border-purple-500/50 hover:text-purple-400"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {STATUS_COLUMNS.map((col) => {
          const colTasks = tasks
            .filter((t) => t.status === col.key)
            .sort((a, b) => {
              const order = { critical: 0, high: 1, medium: 2, low: 3 }
              return order[a.priority] - order[b.priority]
            })

          return (
            <div key={col.key}>
              <div className="mb-3 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${col.gradient}`} />
                <h3 className="text-sm font-bold text-white">{col.label}</h3>
                <span className="ml-auto text-xs text-gray-500">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {colTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-800 p-6 text-center text-xs text-gray-600">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
