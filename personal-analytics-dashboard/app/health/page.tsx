"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { FitnessTracker } from "@/components/health/fitness-tracker"
import { mockHealthMetrics } from "@/lib/mock-data"

export default function HealthPage() {
  const mod = getModule("health")!

  return (
    <ModuleLayout module={mod}>
      <div className="max-w-2xl">
        <FitnessTracker metrics={mockHealthMetrics} weeklyStreak={12} />
      </div>
    </ModuleLayout>
  )
}
