"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MODULE_REGISTRY } from "@/lib/protocol"
import { useAppStore } from "@/lib/store"
import { ChevronLeft, ChevronRight, Command, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, toggleCommandPalette } = useAppStore()

  const tactical = MODULE_REGISTRY.filter((m) => m.category === "tactical")
  const strategic = MODULE_REGISTRY.filter((m) => m.category === "strategic")
  const personal = MODULE_REGISTRY.filter((m) => m.category === "personal")
  const system = MODULE_REGISTRY.filter((m) => m.category === "system")

  const renderGroup = (label: string, modules: typeof MODULE_REGISTRY) => (
    <div className="mb-4">
      {!sidebarCollapsed && (
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {modules.map((mod) => {
          const isActive = pathname === mod.href
          const Icon = mod.icon
          return (
            <Link
              key={mod.id}
              href={mod.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br transition-transform group-hover:scale-110",
                  mod.gradient,
                  isActive ? "shadow-lg" : "opacity-70 group-hover:opacity-100"
                )}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="truncate font-medium">{mod.shortName}</span>
              )}
              {!sidebarCollapsed && mod.status === "beta" && (
                <span className="ml-auto text-[10px] rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-400">
                  BETA
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-800 bg-gray-950 transition-all duration-300",
        sidebarCollapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">UNIFIED</p>
              <p className="text-[10px] text-gray-500">Protocol v3.0</p>
            </div>
          )}
        </Link>
      </div>

      {/* Command Palette Trigger */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={toggleCommandPalette}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-gray-500 transition hover:border-gray-700 hover:text-gray-300",
            sidebarCollapsed && "justify-center px-0"
          )}
        >
          <Command className="h-3.5 w-3.5 shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span>Search...</span>
              <kbd className="ml-auto text-[10px] rounded border border-gray-700 px-1.5 py-0.5 font-mono text-gray-600">
                K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        {renderGroup("System", system)}
        {renderGroup("Tactical", tactical)}
        {renderGroup("Strategic", strategic)}
        {renderGroup("Personal", personal)}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-gray-800 p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg py-2 text-gray-500 hover:bg-white/5 hover:text-white transition"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
