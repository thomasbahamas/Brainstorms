"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { RevenueChart } from "@/components/finance/revenue-chart"

export default function FinancePage() {
  const mod = getModule("finance")!

  return (
    <ModuleLayout module={mod}>
      <div className="space-y-8">
        <FinanceOverview />
        <RevenueChart />
      </div>
    </ModuleLayout>
  )
}
