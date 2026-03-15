"use client"

import { useAppStore, Goal, KeyResult } from "@/lib/store"
import { formatNumber } from "@/lib/utils"
import {
  Target,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const CATEGORY_COLORS: Record<string, string> = {
  career: "from-blue-500 to-cyan-500",
  financial: "from-green-500 to-emerald-500",
  health: "from-orange-500 to-red-500",
  learning: "from-purple-500 to-violet-500",
  content: "from-pink-500 to-rose-500",
}

export function GoalTracker() {
  const { goals, addGoal, deleteGoal, updateKeyResult } = useAppStore()
  const [expanded, setExpanded] = useState<string | null>(goals[0]?.id || null)
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "career" as Goal["category"],
    targetDate: "",
  })

  const handleAdd = () => {
    if (!newGoal.title || !newGoal.targetDate) return
    addGoal({
      id: `g${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      progress: 0,
      keyResults: [],
      createdAt: new Date().toISOString().split("T")[0],
    })
    setNewGoal({ title: "", description: "", category: "career", targetDate: "" })
    setShowAdd(false)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "from-green-500 to-emerald-400"
    if (progress >= 50) return "from-blue-500 to-cyan-400"
    if (progress >= 25) return "from-yellow-500 to-orange-400"
    return "from-red-500 to-orange-400"
  }

  return (
    <div className="space-y-4">
      {/* Goals list */}
      {goals.map((goal) => (
        <div
          key={goal.id}
          className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => setExpanded(expanded === goal.id ? null : goal.id)}
            className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/5 transition"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.career
              )}
            >
              <Target className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">
                  {goal.title}
                </h3>
                <span className="text-[10px] rounded bg-gray-800 px-1.5 py-0.5 text-gray-400">
                  {goal.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{goal.description}</p>
            </div>
            {/* Progress ring */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <svg className="h-12 w-12 -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#1f2937" strokeWidth="3" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(goal.progress / 100) * 125.6} 125.6`}
                />
                <defs>
                  <linearGradient id="progress-gradient">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-xs font-bold text-white">
                {goal.progress}%
              </span>
            </div>
            {expanded === goal.id ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {/* Expanded content */}
          {expanded === goal.id && (
            <div className="border-t border-gray-800 p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  Target: {goal.targetDate}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-600 hover:text-red-400 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Key Results */}
              {goal.keyResults.length > 0 ? (
                <div className="space-y-3">
                  {goal.keyResults.map((kr) => (
                    <KeyResultRow
                      key={kr.id}
                      kr={kr}
                      goalId={goal.id}
                      onUpdate={updateKeyResult}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 text-center py-2">
                  No key results defined
                </p>
              )}

              {/* Progress bar */}
              <div className="pt-2">
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all",
                      getProgressColor(goal.progress)
                    )}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Goal */}
      {showAdd ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
          <input
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Goal title"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
          />
          <input
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Description"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
          />
          <div className="flex gap-2">
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal["category"] })}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="career">Career</option>
              <option value="financial">Financial</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="content">Content</option>
            </select>
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500"
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-3 text-sm text-gray-500 hover:border-purple-500/50 hover:text-purple-400 transition"
        >
          <Plus className="h-4 w-4" /> Add New Goal
        </button>
      )}
    </div>
  )
}

function KeyResultRow({
  kr,
  goalId,
  onUpdate,
}: {
  kr: KeyResult
  goalId: string
  onUpdate: (goalId: string, krId: string, current: number) => void
}) {
  const pct = Math.min((kr.current / kr.target) * 100, 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-300">{kr.title}</span>
        <span className="text-xs text-gray-400">
          {formatNumber(kr.current, kr.current >= 1000 ? 1 : 0)} / {formatNumber(kr.target, kr.target >= 1000 ? 1 : 0)} {kr.unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-500 w-8 text-right">{Math.round(pct)}%</span>
      </div>
    </div>
  )
}
