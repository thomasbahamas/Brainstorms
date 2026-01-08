'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface M2DataPoint {
  date: string
  value: number
}

export function BananaZoneChart() {
  const [data, setData] = useState<M2DataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [currentM2, setCurrentM2] = useState<number>(0)
  const [changePercent, setChangePercent] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/macro/m2')
        const json = await res.json()
        setData(json)

        // Calculate current value and change
        if (json.length > 0) {
          const latest = json[json.length - 1].value
          const yearAgo = json[json.length - 13]?.value || json[0].value
          setCurrentM2(latest)
          setChangePercent(((latest - yearAgo) / yearAgo) * 100)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Banana Zone Indicator...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-gray-800/50 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  const isPositive = changePercent >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            The Banana Zone Indicator
          </span>
          <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full">
            Leading Macro Signal
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-gray-400 mb-1">Current M2 Supply</p>
              <p className="text-xl font-bold text-yellow-400">
                ${(currentM2 / 1000).toFixed(2)}T
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">YoY Change</p>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                <p className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tickFormatter={(str) => {
                    const date = new Date(str)
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                  }}
                  minTickGap={50}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  stroke="#9CA3AF"
                  tickFormatter={(val) => `$${(val / 1000).toFixed(1)}T`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#FCD34D' }}
                  formatter={(val: number) => [`$${(val / 1000).toFixed(2)} Trillion`, 'M2 Supply']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FCD34D"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#FCD34D' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insight */}
          <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-semibold text-yellow-400">Liquidity Signal:</span> When this line curves up,
              global liquidity expands. Historically, this precedes crypto repricing events by 3-6 months.
            </p>
            <p className="text-xs text-gray-500">
              Source: Federal Reserve Economic Data (FRED) • Series: M2SL (M2 Money Stock)
            </p>
          </div>

          {/* Action Items */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
            <div>
              <p className="text-sm text-blue-400 font-medium">Content Angle</p>
              <p className="text-xs text-gray-400 mt-1">
                {isPositive
                  ? 'Film "Silent Shift" narrative: Institutional liquidity is back. SOL repricing incoming.'
                  : 'Film "Dry Season" warning: Liquidity contraction = consolidation period. Stack fundamentals.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
