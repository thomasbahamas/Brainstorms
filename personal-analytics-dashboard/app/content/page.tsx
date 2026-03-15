"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { NarrativeTriggers } from "@/components/content/narrative-triggers"
import { VideoIdeas } from "@/components/content/video-ideas"
import { mockVideoIdeas } from "@/lib/mock-data"

export default function ContentPage() {
  const mod = getModule("content")!

  return (
    <ModuleLayout module={mod}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NarrativeTriggers />
        <VideoIdeas ideas={mockVideoIdeas} />
      </div>
    </ModuleLayout>
  )
}
