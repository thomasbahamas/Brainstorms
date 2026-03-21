"use client"

import { Sidebar } from "./sidebar"
import { CommandPalette } from "./command-palette"
import { ToastContainer } from "@/components/ui/toast"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <>
      <Sidebar />
      <CommandPalette />
      <ToastContainer />
      <main
        className={cn(
          "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black transition-all duration-300",
          // Mobile: no sidebar offset, add top bar space
          "pt-14 md:pt-0",
          sidebarCollapsed ? "md:pl-[68px]" : "md:pl-[220px]"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </>
  )
}
