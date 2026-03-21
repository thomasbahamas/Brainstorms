"use client"

import { useAppStore } from "@/lib/store"
import { formatNumber } from "@/lib/utils"
import { TrendingUp, Users, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "text-red-400",
  Twitter: "text-sky-400",
  Discord: "text-indigo-400",
  Telegram: "text-blue-400",
}

export function SocialMetrics() {
  const { socialMetrics } = useAppStore()

  const totalFollowers = socialMetrics.reduce((s, m) => s + m.followers, 0)
  const totalGrowth = socialMetrics.reduce((s, m) => s + m.followersChange, 0)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          Audience
        </h3>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{formatNumber(totalFollowers, 1)}</p>
          <p className="text-[10px] text-green-400">+{formatNumber(totalGrowth, 0)} this month</p>
        </div>
      </div>

      <div className="space-y-3">
        {socialMetrics.map((metric) => (
          <div
            key={metric.platform}
            className="flex items-center gap-3 rounded-lg bg-gray-800/30 px-3 py-2"
          >
            <span className={cn("text-sm font-bold w-20", PLATFORM_COLORS[metric.platform] || "text-gray-400")}>
              {metric.platform}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">
                  {formatNumber(metric.followers, 1)}
                </span>
                <span className="text-[10px] text-green-400">
                  +{formatNumber(metric.followersChange, 0)}
                </span>
              </div>
            </div>
            {metric.views30d > 0 && (
              <div className="flex items-center gap-1 text-right">
                <Eye className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-400">{formatNumber(metric.views30d, 1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-400">{metric.engagement}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
