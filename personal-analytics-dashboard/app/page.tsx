"use client"

import { MODULE_REGISTRY } from "@/lib/protocol"
import { ModuleCard } from "@/components/unified/module-card"
import { useAppStore } from "@/lib/store"
import { MorningBriefing } from "@/components/home/morning-briefing"
import { SocialMetrics } from "@/components/home/social-metrics"
import {
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"

export default function Home() {
  const { tasks, finances, messages, notes } = useAppStore()

  const urgentTasks = tasks.filter((t) => t.priority === "critical" && t.status !== "done")
  const inProgress = tasks.filter((t) => t.status === "in-progress")
  const unread = messages.filter((m) => !m.read)
  const actionRequired = messages.filter((m) => m.actionRequired && !m.read)
  const totalIncome = finances.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0)
  const totalExpenses = finances.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0)
  const pinnedNotes = notes.filter((n) => n.pinned)

  const modules = MODULE_REGISTRY.filter((m) => m.id !== "dashboard")

  return (
    <div className="space-y-8">
      {/* Morning Briefing */}
      <MorningBriefing />

      {/* Live Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Urgent", value: urgentTasks.length, icon: AlertCircle, color: urgentTasks.length > 0 ? "text-red-400" : "text-gray-500" },
          { label: "In Progress", value: inProgress.length, icon: Clock, color: "text-blue-400" },
          { label: "Unread", value: unread.length, icon: MessageSquare, color: unread.length > 0 ? "text-purple-400" : "text-gray-500" },
          { label: "Actions", value: actionRequired.length, icon: Zap, color: actionRequired.length > 0 ? "text-orange-400" : "text-gray-500" },
          { label: "Net Cash", value: formatCurrency(totalIncome - totalExpenses), icon: TrendingUp, color: totalIncome - totalExpenses >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Pinned", value: pinnedNotes.length, icon: CheckCircle2, color: "text-cyan-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-3"
          >
            <stat.icon className={cn("h-5 w-5 shrink-0", stat.color)} />
            <div className="min-w-0">
              <p className={cn("text-lg font-bold leading-tight", stat.color)}>
                {stat.value}
              </p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Actions + Social Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {(urgentTasks.length > 0 || actionRequired.length > 0) && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <h2 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Needs Attention
              </h2>
              <div className="space-y-2">
                {urgentTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg bg-gray-900/50 px-3 py-2 border border-gray-800">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-sm text-white flex-1">{t.title}</span>
                    {t.dueDate && <span className="text-[10px] text-gray-500">{t.dueDate}</span>}
                    <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">task</span>
                  </div>
                ))}
                {actionRequired.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-lg bg-gray-900/50 px-3 py-2 border border-gray-800">
                    <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-sm text-white flex-1">{m.subject}</span>
                    <span className="text-[10px] text-gray-500">{m.from}</span>
                    <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] text-orange-400">{m.platform}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <SocialMetrics />
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-6 text-center">
        <p className="text-xs text-gray-600">
          UNIFIED Protocol v3.0 — One App. Every Domain. Total Control.
        </p>
      </div>
    </div>
  )
}
