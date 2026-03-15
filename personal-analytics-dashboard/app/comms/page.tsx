"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { CommsHub } from "@/components/comms/comms-hub"

export default function CommsPage() {
  const mod = getModule("comms")!

  return (
    <ModuleLayout module={mod}>
      <CommsHub />
    </ModuleLayout>
  )
}
