"use client"

import { useAppStore, CommMessage } from "@/lib/store"
import {
  Mail,
  MessageCircle,
  Youtube,
  Twitter,
  Send,
  Bell,
  AlertCircle,
  CheckCheck,
  Circle,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const PLATFORM_CONFIG = {
  twitter: { icon: Twitter, color: "text-sky-400", bg: "bg-sky-500/10", label: "Twitter/X" },
  youtube: { icon: Youtube, color: "text-red-400", bg: "bg-red-500/10", label: "YouTube" },
  discord: { icon: MessageCircle, color: "text-indigo-400", bg: "bg-indigo-500/10", label: "Discord" },
  telegram: { icon: Send, color: "text-blue-400", bg: "bg-blue-500/10", label: "Telegram" },
  email: { icon: Mail, color: "text-gray-300", bg: "bg-gray-500/10", label: "Email" },
}

function MessageRow({ message }: { message: CommMessage }) {
  const { markMessageRead } = useAppStore()
  const platform = PLATFORM_CONFIG[message.platform]
  const PlatformIcon = platform.icon

  const timeAgo = (() => {
    const diff = Date.now() - new Date(message.timestamp).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  })()

  return (
    <button
      onClick={() => markMessageRead(message.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition hover:border-gray-600",
        message.read ? "border-gray-800/50 bg-gray-900/30" : "border-gray-700 bg-gray-900/70"
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg mt-0.5", platform.bg)}>
        <PlatformIcon className={cn("h-4 w-4", platform.color)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-gray-300 truncate">{message.from}</span>
          {!message.read && <Circle className="h-2 w-2 fill-purple-400 text-purple-400 shrink-0" />}
          {message.actionRequired && (
            <span className="flex items-center gap-0.5 rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-bold text-orange-400 shrink-0">
              <AlertCircle className="h-3 w-3" />
              Action
            </span>
          )}
          <span className="ml-auto text-[10px] text-gray-600 shrink-0">{timeAgo}</span>
        </div>
        <p className={cn("text-sm truncate", message.read ? "text-gray-400" : "text-white font-medium")}>
          {message.subject}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{message.preview}</p>
      </div>
    </button>
  )
}

export function CommsHub() {
  const { messages } = useAppStore()
  const [filter, setFilter] = useState<string | null>(null)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const unreadCount = messages.filter((m) => !m.read).length
  const actionCount = messages.filter((m) => m.actionRequired && !m.read).length

  const filtered = messages
    .filter((m) => {
      if (filter && m.platform !== filter) return false
      if (showUnreadOnly && m.read) return false
      return true
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const platforms = Object.keys(PLATFORM_CONFIG) as Array<keyof typeof PLATFORM_CONFIG>

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-400">Unread</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{unreadCount}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-gray-400">Action Required</span>
          </div>
          <p className="text-2xl font-bold text-orange-400">{actionCount}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCheck className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-400">Read</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{messages.filter((m) => m.read).length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-white" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{messages.length}</p>
        </div>
      </div>

      {/* Platform Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-500" />
        <button
          onClick={() => setFilter(null)}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition", !filter ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}
        >
          All
        </button>
        {platforms.map((p) => {
          const conf = PLATFORM_CONFIG[p]
          const count = messages.filter((m) => m.platform === p).length
          return (
            <button
              key={p}
              onClick={() => setFilter(filter === p ? null : p)}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition", filter === p ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}
            >
              <conf.icon className={cn("h-3.5 w-3.5", filter === p ? conf.color : "")} />
              {conf.label}
              <span className="text-gray-600">({count})</span>
            </button>
          )
        })}

        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={cn("ml-auto rounded-lg px-3 py-1.5 text-xs font-medium transition", showUnreadOnly ? "bg-purple-500/20 text-purple-400" : "text-gray-500 hover:text-white")}
        >
          Unread only
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {filtered.map((msg) => (
          <MessageRow key={msg.id} message={msg} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-800 p-12 text-center text-gray-500">
            {showUnreadOnly ? "All caught up!" : "No messages"}
          </div>
        )}
      </div>
    </div>
  )
}
