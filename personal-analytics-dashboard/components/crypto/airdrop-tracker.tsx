'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AirdropOpportunity } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Gift, Clock, CheckCircle2, Circle } from "lucide-react"

interface AirdropTrackerProps {
  airdrops: AirdropOpportunity[]
}

export function AirdropTracker({ airdrops }: AirdropTrackerProps) {
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'active':
        return <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-pink-500" />
          Airdrop Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {airdrops.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active airdrops</p>
          ) : (
            airdrops.map((airdrop) => (
              <div
                key={airdrop.id}
                className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all border border-gray-700 hover:border-pink-500/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(airdrop.status)}
                      <h3 className="font-semibold text-white">{airdrop.protocol}</h3>
                    </div>
                    <p className="text-sm text-gray-400">{airdrop.chain}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-pink-400">
                      ~{formatCurrency(airdrop.estimatedValue)}
                    </p>
                    <p className={`text-xs ${getEffortColor(airdrop.effort)}`}>
                      {airdrop.effort} effort
                    </p>
                  </div>
                </div>

                {airdrop.userProgress !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{airdrop.userProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${airdrop.userProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Requirements:</p>
                  {airdrop.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-pink-500 mt-1.5" />
                      <p className="text-sm text-gray-300">{req}</p>
                    </div>
                  ))}
                </div>

                {airdrop.deadline && (
                  <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-400">Deadline:</span>
                    <span className="text-white font-medium">{airdrop.deadline}</span>
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
