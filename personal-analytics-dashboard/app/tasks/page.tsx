"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { TaskBoard } from "@/components/tasks/task-board"

export default function TasksPage() {
  const mod = getModule("tasks")!

  return (
    <ModuleLayout module={mod}>
      <TaskBoard />
    </ModuleLayout>
  )
}
