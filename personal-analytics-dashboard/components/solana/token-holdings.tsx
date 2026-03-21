'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenHolding } from "@/types"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Coins, TrendingUp, TrendingDown, Loader2 } from "lucide-react"

interface TokenHoldingsProps {
  tokens: TokenHolding[]
  isLoading?: boolean
}

export function TokenHoldings({ tokens, isLoading = false }: TokenHoldingsProps) {
  const totalValue = tokens.reduce((sum, token) => sum + token.usdValue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-500" />
            Token Holdings
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
          </span>
          <span className="text-lg text-gray-400">
            {formatCurrency(totalValue)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading && tokens.length === 0 ? (
            <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading wallet...</span>
            </div>
          ) : tokens.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No tokens found</p>
          ) : (
            tokens.map((token) => (
              <div
                key={token.mint}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{token.symbol}</p>
                    <p className="text-sm text-gray-400">
                      {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatCurrency(token.usdValue)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    {token.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {formatPercentage(token.change24h)}
                    </span>
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
