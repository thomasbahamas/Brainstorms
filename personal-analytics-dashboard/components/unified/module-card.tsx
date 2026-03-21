"use client"

import Link from "next/link"
import { AppModule } from "@/lib/protocol"
import { ArrowUpRight } from "lucide-react"

export function ModuleCard({ module }: { module: AppModule }) {
  const Icon = module.icon

  return (
    <Link href={module.href} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-all hover:border-gray-700 hover:bg-gray-900/80 hover:shadow-xl hover:shadow-purple-500/5">
        {/* Gradient accent */}
        <div
          className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${module.gradient} opacity-50 transition-opacity group-hover:opacity-100`}
        />

        <div className="flex items-start justify-between mb-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient} shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-gray-600 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">{module.name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          {module.description}
        </p>

        {module.stats && module.stats.length > 0 && (
          <div className="mt-4 flex gap-4 border-t border-gray-800 pt-3">
            {module.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
