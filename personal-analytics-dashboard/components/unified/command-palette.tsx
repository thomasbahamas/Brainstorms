"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { MODULE_REGISTRY } from "@/lib/protocol"
import { Search, ArrowRight, X } from "lucide-react"

interface SearchResult {
  type: "module" | "task" | "note" | "action"
  title: string
  subtitle: string
  href?: string
  action?: () => void
  icon?: string
}

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, toggleCommandPalette, tasks, notes } = useAppStore()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const q = query.toLowerCase()

  const results: SearchResult[] = []

  // Modules
  MODULE_REGISTRY.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.shortName.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  ).forEach((m) =>
    results.push({
      type: "module",
      title: m.name,
      subtitle: m.description,
      href: m.href,
    })
  )

  // Tasks
  if (q) {
    tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
      )
      .forEach((t) =>
        results.push({
          type: "task",
          title: t.title,
          subtitle: `${t.status} · ${t.priority} priority`,
          href: "/tasks",
        })
      )
  }

  // Notes
  if (q) {
    notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((tag) => tag.includes(q))
      )
      .forEach((n) =>
        results.push({
          type: "note",
          title: n.title,
          subtitle: `${n.category} · ${n.tags.slice(0, 3).join(", ")}`,
          href: "/knowledge",
        })
      )
  }

  const visibleResults = results.slice(0, 12)

  const handleSelect = useCallback((result: SearchResult) => {
    if (result.href) router.push(result.href)
    if (result.action) result.action()
    toggleCommandPalette()
  }, [router, toggleCommandPalette])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggleCommandPalette()
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        toggleCommandPalette()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [commandPaletteOpen, toggleCommandPalette])

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, visibleResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && visibleResults[selectedIndex]) {
      e.preventDefault()
      handleSelect(visibleResults[selectedIndex])
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return
    const selected = resultsRef.current.children[selectedIndex] as HTMLElement
    if (selected) selected.scrollIntoView({ block: "nearest" })
  }, [selectedIndex])

  if (!commandPaletteOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCommandPalette}
      />

      {/* Palette */}
      <div className="relative w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-gray-800 px-4">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search modules, tasks, notes, actions..."
            className="flex-1 bg-transparent py-4 text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={toggleCommandPalette}
            className="rounded p-1 text-gray-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto p-2">
          {visibleResults.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No results found
            </div>
          ) : (
            visibleResults.map((result, i) => (
              <button
                key={i}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                  i === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="flex h-6 min-w-[52px] items-center justify-center rounded bg-gray-800 px-2 text-[10px] font-bold uppercase text-gray-400">
                  {result.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {result.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {result.subtitle}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-600" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-800 px-4 py-2 text-[11px] text-gray-600">
          <span>
            <kbd className="rounded border border-gray-700 px-1 py-0.5 font-mono">↑↓</kbd> navigate
            {" · "}
            <kbd className="rounded border border-gray-700 px-1 py-0.5 font-mono">↵</kbd> select
          </span>
          <span>
            <kbd className="rounded border border-gray-700 px-1 py-0.5 font-mono">
              Esc
            </kbd>{" "}
            to close
          </span>
        </div>
      </div>
    </div>
  )
}
