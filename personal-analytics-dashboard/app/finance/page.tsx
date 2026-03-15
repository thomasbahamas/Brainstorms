"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { FinanceOverview } from "@/components/finance/finance-overview"

export default function FinancePage() {
  const mod = getModule("finance")!

  return (
    <ModuleLayout module={mod}>
      <FinanceOverview />
    </ModuleLayout>
  )
}
