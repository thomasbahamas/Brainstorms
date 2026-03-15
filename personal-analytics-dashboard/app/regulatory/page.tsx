"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { RegulatoryCommandCenter } from "@/components/regulatory/regulatory-command-center"

export default function RegulatoryPage() {
  const mod = getModule("regulatory")!

  return (
    <ModuleLayout module={mod}>
      <RegulatoryCommandCenter />
    </ModuleLayout>
  )
}
