"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { DailyJournal } from "@/components/journal/daily-journal"

export default function JournalPage() {
  const mod = getModule("journal")!

  return (
    <ModuleLayout module={mod}>
      <div className="max-w-2xl">
        <DailyJournal />
      </div>
    </ModuleLayout>
  )
}
