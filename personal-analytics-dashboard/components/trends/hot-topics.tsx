'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HotTopic } from "@/types"
import { formatNumber } from "@/lib/utils"
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface HotTopicsProps {
  topics: HotTopic[]
}

export function HotTopics({ topics }: HotTopicsProps) {
  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return 'bg-green-500'
    if (sentiment < 0.4) return 'bg-red-500'
    return 'bg-yellow-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          Hot Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topics.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Loading hot topics...</p>
          ) : (
            topics.map((topic, idx) => (
              <div
                key={topic.id}
                className="p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-900 transition-all border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{topic.topic}</h3>
                      <p className="text-xs text-gray-400">{topic.category}</p>
                    </div>
                  </div>
                  {getTrendingIcon(topic.trending)}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Volume (24h)</p>
                    <p className="text-sm font-semibold text-white">
                      {formatNumber(topic.volume)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mentions</p>
                    <p className="text-sm font-semibold text-white">
                      {formatNumber(topic.mentions24h)}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Sentiment</span>
                    <span>{(topic.sentiment * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getSentimentColor(topic.sentiment)}`}
                      style={{ width: `${topic.sentiment * 100}%` }}
                    />
                  </div>
                </div>

                {topic.relatedTokens.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Related Tokens:</p>
                    <div className="flex flex-wrap gap-1">
                      {topic.relatedTokens.map((token) => (
                        <span
                          key={token}
                          className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
