'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CryptoNarrative } from "@/types"
import { formatNumber, formatPercentage } from "@/lib/utils"
import { TrendingUp, Flame, Zap } from "lucide-react"

interface NarrativesTrackerProps {
  narratives: CryptoNarrative[]
}

export function NarrativesTracker({ narratives }: NarrativesTrackerProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500'
      case 'bearish': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-500/10 border-green-500/20'
      case 'bearish': return 'bg-red-500/10 border-red-500/20'
      default: return 'bg-yellow-500/10 border-yellow-500/20'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Crypto Narratives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {narratives.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Loading narratives...</p>
          ) : (
            narratives.map((narrative) => (
              <div
                key={narrative.id}
                className={`p-4 rounded-lg border ${getSentimentBg(narrative.sentiment)} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{narrative.name}</h3>
                    {narrative.trending && (
                      <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(narrative.sentiment)} bg-gray-800`}>
                    {narrative.sentiment}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-3">{narrative.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Market Cap: </span>
                    <span className="text-white font-medium">
                      ${formatNumber(narrative.marketCap)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className={narrative.change7d >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {formatPercentage(narrative.change7d)} 7d
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Top Projects:</p>
                  <div className="flex flex-wrap gap-1">
                    {narrative.topProjects.map((project) => (
                      <span
                        key={project}
                        className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
