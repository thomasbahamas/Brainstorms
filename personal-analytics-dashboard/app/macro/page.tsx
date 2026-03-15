"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { BananaZoneChart } from "@/components/macro/banana-zone-chart"
import { RealMoneyWorkstation } from "@/components/rwa/real-money-workstation"

export default function MacroPage() {
  const mod = getModule("macro")!

  return (
    <ModuleLayout module={mod}>
      <div className="space-y-6">
        <BananaZoneChart />
        <RealMoneyWorkstation />
      </div>
    </ModuleLayout>
  )
}
