"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { GoalTracker } from "@/components/goals/goal-tracker"

export default function GoalsPage() {
  const mod = getModule("goals")!

  return (
    <ModuleLayout module={mod}>
      <div className="max-w-3xl">
        <GoalTracker />
      </div>
    </ModuleLayout>
  )
}
