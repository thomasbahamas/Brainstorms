"use client"

import { Sidebar } from "./sidebar"
import { CommandPalette } from "./command-palette"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <>
      <Sidebar />
      <CommandPalette />
      <main
        className={cn(
          "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black transition-all duration-300",
          sidebarCollapsed ? "pl-[68px]" : "pl-[220px]"
        )}
      >
        <div className="container mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
    </>
  )
}
