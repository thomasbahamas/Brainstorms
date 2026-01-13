'use client'

import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/types"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Wallet, TrendingUp, Gift, Lightbulb, Flame, Video } from "lucide-react"

interface StatsOverviewProps {
  stats: DashboardStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Portfolio Value",
      value: formatCurrency(stats.totalPortfolioValue),
      change: formatPercentage(stats.portfolioChange24h),
      icon: Wallet,
      color: "purple",
      isPositive: stats.portfolioChange24h >= 0
    },
    {
      title: "Active Airdrops",
      value: stats.activeAirdrops.toString(),
      subtitle: "opportunities",
      icon: Gift,
      color: "pink",
    },
    {
      title: "Pending Trades",
      value: stats.pendingOpportunities.toString(),
      subtitle: "signals",
      icon: TrendingUp,
      color: "cyan",
    },
    {
      title: "Video Ideas",
      value: stats.contentIdeas.toString(),
      subtitle: "in queue",
      icon: Video,
      color: "blue",
    },
    {
      title: "Health Streak",
      value: `${stats.healthStreak} days`,
      subtitle: "keep it up!",
      icon: Flame,
      color: "orange",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      purple: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", icon: "text-purple-500" },
      pink: { bg: "bg-pink-500/10 border-pink-500/20", text: "text-pink-400", icon: "text-pink-500" },
      cyan: { bg: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-400", icon: "text-cyan-500" },
      blue: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", icon: "text-blue-500" },
      orange: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", icon: "text-orange-500" },
    }
    return colors[color]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const colors = getColorClasses(stat.color)
        const Icon = stat.icon

        return (
          <Card key={stat.title} className={`${colors.bg} border`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-400">{stat.title}</p>
                <Icon className={`h-5 w-5 ${colors.icon}`} />
              </div>
              <p className={`text-2xl font-bold ${colors.text} mb-1`}>
                {stat.value}
              </p>
              {stat.change && (
                <p className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} 24h
                </p>
              )}
              {stat.subtitle && (
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
