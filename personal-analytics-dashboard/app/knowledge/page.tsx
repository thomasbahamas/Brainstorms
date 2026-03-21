"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { KnowledgeBase } from "@/components/knowledge/knowledge-base"

export default function KnowledgePage() {
  const mod = getModule("knowledge")!

  return (
    <ModuleLayout module={mod}>
      <KnowledgeBase />
    </ModuleLayout>
  )
}
