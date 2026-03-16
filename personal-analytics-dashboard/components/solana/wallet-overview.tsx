'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercentage, truncateAddress } from "@/lib/utils"
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from "lucide-react"

interface WalletOverviewProps {
  address?: string
  balance: number
  usdValue: number
  change24h: number
  isLive?: boolean
  lastUpdated?: string | null
}

export function WalletOverview({
  address = "Connect Wallet",
  balance = 0,
  usdValue = 0,
  change24h = 0,
  isLive = false,
  lastUpdated = null,
}: WalletOverviewProps) {
  const isPositive = change24h >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-purple-500" />
          Solana Wallet
          {isLive ? (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
              <Wifi className="h-3 w-3" />
              LIVE
            </span>
          ) : (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] text-gray-500">
              <WifiOff className="h-3 w-3" />
              MOCK
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Address</p>
            <p className="text-lg font-mono text-white">
              {address.length > 20 ? truncateAddress(address) : address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">SOL Balance</p>
              <p className="text-2xl font-bold text-white">
                {balance.toFixed(4)} SOL
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">USD Value</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(usdValue)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(change24h)} 24h
              </span>
            </div>
            {lastUpdated && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <RefreshCw className="h-3 w-3" />
                {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
