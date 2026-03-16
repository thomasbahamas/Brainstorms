"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { useLiveWallet } from "@/lib/hooks/use-solana"
import {
  Sun,
  Moon,
  Target,
  Flame,
  TrendingUp,
  TrendingDown,
  Video,
  Calendar,
  Wallet,
  Wifi,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

export function MorningBriefing() {
  const { tasks, finances, habits, goals, videoIdeas, journal } = useAppStore()
  const { data: liveWallet, isLoading: walletLoading } = useLiveWallet(WALLET_ADDRESS)

  const today = format(new Date(), "yyyy-MM-dd")
  const todayFormatted = format(new Date(), "EEEE, MMMM d")

  // Calculate briefing data
  const urgentTasks = tasks.filter(
    (t) => t.priority === "critical" && t.status !== "done"
  )
  const dueSoon = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false
    const due = new Date(t.dueDate)
    const diff = (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff <= 3 && diff >= 0
  })
  const todayHabits = habits.filter((h) => h.frequency === "daily")
  const completedToday = todayHabits.filter((h) =>
    h.completedDates.includes(today)
  )
  const currentStreak = habits.find((h) => h.id === "h1")?.completedDates.length || 0

  const totalIncome = finances
    .filter((f) => f.type === "income")
    .reduce((s, f) => s + f.amount, 0)
  const totalExpenses = finances
    .filter((f) => f.type === "expense")
    .reduce((s, f) => s + f.amount, 0)

  const topGoal = goals.sort((a, b) => b.progress - a.progress)[0]
  const inFilming = videoIdeas.filter((v) => v.status === "filming" || v.status === "editing")

  const hasJournalToday = journal.some((j) => j.date === today)

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const GreeingIcon = hour < 17 ? Sun : Moon

  return (
    <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
          <GreeingIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{greeting}</h2>
          <p className="text-xs text-gray-400">{todayFormatted}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio */}
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Portfolio</h3>
            {liveWallet && (
              <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400">
                <Wifi className="h-2.5 w-2.5" /> LIVE
              </span>
            )}
          </div>
          {walletLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : liveWallet ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">{formatCurrency(liveWallet.totalValue)}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{liveWallet.solBalance.toFixed(2)} SOL</span>
                <span className="text-[10px] text-gray-600">@ {formatCurrency(liveWallet.solPrice)}</span>
              </div>
              <div className="flex items-center gap-1">
                {liveWallet.tokens[0]?.change24h >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${(liveWallet.tokens[0]?.change24h ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  SOL {(liveWallet.tokens[0]?.change24h ?? 0) >= 0 ? "+" : ""}{(liveWallet.tokens[0]?.change24h ?? 0).toFixed(2)}% 24h
                </span>
              </div>
              <p className="text-[10px] text-gray-600">{liveWallet.tokens.length} tokens tracked</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-500">{formatCurrency(27825)}</p>
              <p className="text-[10px] text-gray-600">Mock data — set NEXT_PUBLIC_SOLANA_WALLET to connect</p>
            </div>
          )}
        </div>

        {/* Today's Focus */}
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-bold text-white">Today&apos;s Focus</h3>
          </div>
          <div className="space-y-2">
            {urgentTasks.length > 0 ? (
              urgentTasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="text-sm text-gray-300 truncate">{t.title}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No urgent tasks</p>
            )}
            {dueSoon.length > 0 && (
              <div className="pt-2 border-t border-gray-700/50">
                <p className="text-[10px] text-orange-400 mb-1">Due within 3 days:</p>
                {dueSoon.slice(0, 2).map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-gray-400 truncate">{t.title}</span>
                    <span className="text-[10px] text-gray-600 ml-auto">{t.dueDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Habits & Streak */}
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white">Habits</h3>
            <span className="ml-auto text-xs text-orange-400">{currentStreak} day streak</span>
          </div>
          <div className="space-y-2">
            {todayHabits.map((h) => {
              const done = h.completedDates.includes(today)
              return (
                <div key={h.id} className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded border ${
                      done
                        ? "border-green-500 bg-green-500/20"
                        : "border-gray-600"
                    }`}
                  >
                    {done && (
                      <svg viewBox="0 0 16 16" className="h-4 w-4 text-green-400">
                        <path d="M4 8l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${done ? "text-gray-400 line-through" : "text-gray-300"}`}>
                    {h.name}
                  </span>
                </div>
              )
            })}
            <p className="text-[10px] text-gray-500 pt-1">
              {completedToday.length}/{todayHabits.length} completed today
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-bold text-white">Quick Stats</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Net Cash</span>
              <span className={`text-sm font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatCurrency(totalIncome - totalExpenses)}
              </span>
            </div>
            {topGoal && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate mr-2">{topGoal.title.slice(0, 20)}...</span>
                <span className="text-sm font-bold text-purple-400">{topGoal.progress}%</span>
              </div>
            )}
            {inFilming.length > 0 && (
              <div className="flex items-center gap-2">
                <Video className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-gray-400">
                  {inFilming.length} video{inFilming.length > 1 ? "s" : ""} in production
                </span>
              </div>
            )}
            {!hasJournalToday && (
              <p className="text-[10px] text-amber-400/60 pt-1">
                No journal entry today — reflect before bed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
