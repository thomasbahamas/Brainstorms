"use client"

import { useAppStore } from "@/lib/store"
import {
  Flame,
  Plus,
  Trash2,
  Dumbbell,
  BookOpen,
  Brain,
  Video,
  Wallet,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { format, subDays, startOfWeek, addDays } from "date-fns"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  book: BookOpen,
  brain: Brain,
  video: Video,
  wallet: Wallet,
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; fill: string }> = {
  green: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", fill: "bg-green-500" },
  blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", fill: "bg-blue-500" },
  purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", fill: "bg-purple-500" },
  pink: { bg: "bg-pink-500/20", border: "border-pink-500/30", text: "text-pink-400", fill: "bg-pink-500" },
  orange: { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400", fill: "bg-orange-500" },
}

export function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabitDate } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", icon: "dumbbell", color: "green", frequency: "daily" as "daily" | "weekly" })

  const today = format(new Date(), "yyyy-MM-dd")

  // Generate last 21 days for the calendar
  const days = Array.from({ length: 21 }, (_, i) => {
    const date = subDays(new Date(), 20 - i)
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "d"),
      dayOfWeek: format(date, "EEE"),
      isToday: format(date, "yyyy-MM-dd") === today,
    }
  })

  const handleAdd = () => {
    if (!newHabit.name) return
    addHabit({
      id: `h${Date.now()}`,
      name: newHabit.name,
      icon: newHabit.icon,
      frequency: newHabit.frequency,
      color: newHabit.color,
      completedDates: [],
      createdAt: today,
    })
    setNewHabit({ name: "", icon: "dumbbell", color: "green", frequency: "daily" })
    setShowAdd(false)
  }

  const getStreak = (completedDates: string[]) => {
    let streak = 0
    for (let i = 0; i < 90; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd")
      if (completedDates.includes(d)) streak++
      else break
    }
    return streak
  }

  return (
    <div className="space-y-6">
      {/* Habit Grid with Calendar */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
        {/* Day headers */}
        <div className="flex items-center border-b border-gray-800">
          <div className="w-40 shrink-0 px-4 py-2">
            <span className="text-xs font-bold text-gray-400">Habit</span>
          </div>
          <div className="flex flex-1 overflow-x-auto">
            {days.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[32px] py-2",
                  day.isToday && "bg-purple-500/10"
                )}
              >
                <span className="text-[9px] text-gray-600">{day.dayOfWeek}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    day.isToday ? "text-purple-400" : "text-gray-500"
                  )}
                >
                  {day.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-16 shrink-0 px-2 py-2 text-center">
            <span className="text-[9px] text-gray-500">Streak</span>
          </div>
        </div>

        {/* Habit rows */}
        {habits.map((habit) => {
          const colors = COLOR_MAP[habit.color] || COLOR_MAP.green
          const Icon = ICON_MAP[habit.icon] || Flame
          const streak = getStreak(habit.completedDates)

          return (
            <div
              key={habit.id}
              className="flex items-center border-b border-gray-800/50 last:border-0 group"
            >
              <div className="flex w-40 shrink-0 items-center gap-2 px-4 py-3">
                <Icon className={cn("h-4 w-4", colors.text)} />
                <span className="text-sm text-gray-300 truncate">{habit.name}</span>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 transition ml-auto"
                >
                  <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-400" />
                </button>
              </div>
              <div className="flex flex-1 overflow-x-auto">
                {days.map((day) => {
                  const completed = habit.completedDates.includes(day.date)
                  return (
                    <button
                      key={day.date}
                      onClick={() => toggleHabitDate(habit.id, day.date)}
                      className={cn(
                        "flex min-w-[32px] h-8 items-center justify-center transition-all",
                        day.isToday && "bg-purple-500/5"
                      )}
                    >
                      <div
                        className={cn(
                          "h-5 w-5 rounded-md flex items-center justify-center transition-all",
                          completed
                            ? `${colors.fill} shadow-sm shadow-${habit.color}-500/20`
                            : "bg-gray-800/80 hover:bg-gray-700"
                        )}
                      >
                        {completed && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="w-16 shrink-0 flex items-center justify-center px-2">
                {streak > 0 ? (
                  <span className={cn("flex items-center gap-1 text-xs font-bold", colors.text)}>
                    <Flame className="h-3 w-3" />
                    {streak}
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Habit */}
      {showAdd ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
          <input
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            placeholder="Habit name"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2">
            <select
              value={newHabit.icon}
              onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="dumbbell">Dumbbell</option>
              <option value="book">Book</option>
              <option value="brain">Brain</option>
              <option value="video">Video</option>
              <option value="wallet">Wallet</option>
            </select>
            <select
              value={newHabit.color}
              onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="orange">Orange</option>
            </select>
            <select
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as "daily" | "weekly" })}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500">
              Add Habit
            </button>
            <button onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-3 text-sm text-gray-500 hover:border-purple-500/50 hover:text-purple-400 transition"
        >
          <Plus className="h-4 w-4" /> Add Habit
        </button>
      )}
    </div>
  )
}
