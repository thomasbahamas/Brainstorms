'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TradingSignal } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react"

interface TradingSignalsProps {
  signals: TradingSignal[]
}

export function TradingSignals({ signals }: TradingSignalsProps) {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'sell':
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'bg-green-500/10 border-green-500/30 text-green-500'
      case 'sell': return 'bg-red-500/10 border-red-500/30 text-red-500'
      default: return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-cyan-500" />
          Trading Signals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {signals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active signals</p>
          ) : (
            signals.map((signalData) => (
              <div
                key={signalData.id}
                className={`p-4 rounded-lg border ${getSignalColor(signalData.signal)} transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSignalIcon(signalData.signal)}
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {signalData.token}
                      </h3>
                      <p className="text-xs text-gray-400 uppercase font-medium">
                        {signalData.signal}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Confidence</p>
                    <p className="text-lg font-bold text-white">
                      {signalData.confidence}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(signalData.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    <p className="text-sm font-semibold text-green-400">
                      {formatCurrency(signalData.targetPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
                    <p className="text-sm font-semibold text-red-400">
                      {formatCurrency(signalData.stopLoss)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Reasoning:</p>
                  <p className="text-sm text-gray-300">{signalData.reasoning}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
