'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthMetrics } from "@/types"
import { formatNumber } from "@/lib/utils"
import { Activity, Flame, Moon, Droplet, Scale, Footprints } from "lucide-react"

interface FitnessTrackerProps {
  metrics: HealthMetrics | null
  weeklyStreak: number
}

export function FitnessTracker({ metrics, weeklyStreak }: FitnessTrackerProps) {
  const getIntensityColor = (intensity?: string) => {
    switch (intensity) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Health & Fitness
          </span>
          <span className="text-sm text-gray-400">
            {weeklyStreak} day streak 🔥
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!metrics ? (
          <p className="text-gray-400 text-center py-8">No data for today</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {metrics.weight && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="h-4 w-4 text-blue-400" />
                    <p className="text-xs text-gray-400">Weight</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {metrics.weight} <span className="text-sm text-gray-400">lbs</span>
                  </p>
                </div>
              )}

              {metrics.steps && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Footprints className="h-4 w-4 text-green-400" />
                    <p className="text-xs text-gray-400">Steps</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {formatNumber(metrics.steps, 0)}
                  </p>
                </div>
              )}

              {metrics.sleep && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Moon className="h-4 w-4 text-purple-400" />
                    <p className="text-xs text-gray-400">Sleep</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {metrics.sleep} <span className="text-sm text-gray-400">hrs</span>
                  </p>
                </div>
              )}

              {metrics.water && (
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplet className="h-4 w-4 text-cyan-400" />
                    <p className="text-xs text-gray-400">Water</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {metrics.water} <span className="text-sm text-gray-400">oz</span>
                  </p>
                </div>
              )}
            </div>

            {metrics.workout && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <h4 className="font-semibold text-white">Workout</h4>
                  </div>
                  <span className={`text-sm ${getIntensityColor(metrics.workout.intensity)}`}>
                    {metrics.workout.intensity} intensity
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Type</p>
                    <p className="text-sm font-semibold text-white capitalize">
                      {metrics.workout.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-sm font-semibold text-white">
                      {metrics.workout.duration} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Calories</p>
                    <p className="text-sm font-semibold text-white">
                      {metrics.workout.caloriesBurned}
                    </p>
                  </div>
                </div>

                {metrics.workout.notes && (
                  <p className="text-sm text-gray-400 mt-3 pt-3 border-t border-gray-700">
                    {metrics.workout.notes}
                  </p>
                )}
              </div>
            )}

            {metrics.calories && (
              <div className="pt-3 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Calories</span>
                  <span className="text-lg font-bold text-white">
                    {formatNumber(metrics.calories, 0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
