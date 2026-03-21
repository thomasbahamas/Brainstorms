"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { HabitTracker } from "@/components/habits/habit-tracker"

export default function HabitsPage() {
  const mod = getModule("habits")!

  return (
    <ModuleLayout module={mod}>
      <HabitTracker />
    </ModuleLayout>
  )
}
