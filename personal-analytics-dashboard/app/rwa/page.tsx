"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { RealMoneyWorkstation } from "@/components/rwa/real-money-workstation"

export default function RWAPage() {
  const mod = getModule("rwa")!

  return (
    <ModuleLayout module={mod}>
      <RealMoneyWorkstation />
    </ModuleLayout>
  )
}
