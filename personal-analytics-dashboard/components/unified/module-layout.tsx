"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AppModule } from "@/lib/protocol"

export function ModuleLayout({
  module,
  children,
}: {
  module: AppModule
  children: React.ReactNode
}) {
  const Icon = module.icon

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-gray-700 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">{module.name}</h1>
          <p className="text-sm text-gray-400">{module.description}</p>
        </div>
      </div>

      {/* Module Content */}
      {children}
    </div>
  )
}
