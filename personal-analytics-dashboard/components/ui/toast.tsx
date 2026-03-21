"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

// Simple global toast state
let toastListeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function notify(listeners: typeof toastListeners) {
  listeners.forEach((fn) => fn([...toasts]))
}

export function toast(message: string, type: Toast["type"] = "success") {
  const id = `toast-${Date.now()}`
  toasts.push({ id, message, type })
  notify(toastListeners)
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notify(toastListeners)
  }, 3000)
}

export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(() => {
    toastListeners.push(setItems)
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setItems)
    }
  }, [])

  if (items.length === 0) return null

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }
  const colors = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-md:left-4">
      {items.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur animate-in slide-in-from-bottom-2",
              colors[t.type]
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => {
                toasts = toasts.filter((x) => x.id !== t.id)
                notify(toastListeners)
              }}
              className="shrink-0 opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
