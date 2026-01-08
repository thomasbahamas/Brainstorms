'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { DollarSign, TrendingUp, Shield, Zap } from 'lucide-react'

interface StablecoinMetrics {
  symbol: string
  supply: number
  dailyVolume: number
  velocityScore: number
  change24h: number
}

interface RWAProtocol {
  name: string
  category: string
  tvl: number
  yield: number
  risk: 'low' | 'medium' | 'high'
}

export function RealMoneyWorkstation() {
  // Mock data - in production, fetch from DefiLlama/Artemis APIs
  const stablecoins: StablecoinMetrics[] = [
    {
      symbol: 'USDC',
      supply: 32500000000,
      dailyVolume: 8200000000,
      velocityScore: 0.25,
      change24h: 2.1
    },
    {
      symbol: 'USDT',
      supply: 12400000000,
      dailyVolume: 5100000000,
      velocityScore: 0.41,
      change24h: 1.8
    },
    {
      symbol: 'PYUSD',
      supply: 820000000,
      dailyVolume: 180000000,
      velocityScore: 0.22,
      change24h: 8.5
    }
  ]

  const rwaProtocols: RWAProtocol[] = [
    { name: 'Ondo Finance', category: 'Treasuries', tvl: 580000000, yield: 5.2, risk: 'low' },
    { name: 'Maple Finance', category: 'Credit', tvl: 420000000, yield: 8.5, risk: 'medium' },
    { name: 'Centrifuge', category: 'Asset Backed', tvl: 280000000, yield: 6.8, risk: 'medium' }
  ]

  const defiYield = 7.2 // JitoSOL yield
  const riskFreeYield = 5.2 // Treasury yield from Ondo

  const totalStablecoinSupply = stablecoins.reduce((sum, coin) => sum + coin.supply, 0)
  const totalStablecoinVolume = stablecoins.reduce((sum, coin) => sum + coin.dailyVolume, 0)
  const avgVelocity = stablecoins.reduce((sum, coin) => sum + coin.velocityScore, 0) / stablecoins.length

  const yieldSpread = defiYield - riskFreeYield
  const marketSentiment = yieldSpread > 2 ? 'Risk On' : 'Risk Off'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Real Money Workstation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-gray-400 mb-1">Total Supply (Solana)</p>
              <p className="text-lg font-bold text-green-400">
                ${formatNumber(totalStablecoinSupply / 1e9, 2)}B
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-gray-400 mb-1">Daily Volume</p>
              <p className="text-lg font-bold text-blue-400">
                ${formatNumber(totalStablecoinVolume / 1e9, 2)}B
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs text-gray-400 mb-1">Avg Velocity</p>
              <p className="text-lg font-bold text-purple-400">
                {avgVelocity.toFixed(2)}x
              </p>
            </div>
          </div>

          {/* Stablecoin Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Stablecoin Activity (Real Economy Signal)
            </h3>
            <div className="space-y-2">
              {stablecoins.map((coin) => (
                <div
                  key={coin.symbol}
                  className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{coin.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{coin.symbol}</p>
                        <p className="text-xs text-gray-400">Velocity: {coin.velocityScore.toFixed(2)}x</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        ${formatNumber(coin.supply / 1e9, 2)}B
                      </p>
                      <p className={`text-xs ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(1)}% 24h
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(coin.velocityScore * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yield Spread Analysis */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Market Risk Signal</h4>
                <p className="text-xs text-gray-400">DeFi Yield vs. Risk-Free Rate</p>
              </div>
              <span className={`text-lg font-bold ${yieldSpread > 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                {marketSentiment}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">DeFi (JitoSOL)</p>
                <p className="text-lg font-bold text-purple-400">{defiYield.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Risk-Free (Ondo)</p>
                <p className="text-lg font-bold text-green-400">{riskFreeYield.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Spread</p>
                <p className="text-lg font-bold text-orange-400">{yieldSpread.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {yieldSpread > 2
                ? '🟢 Wide spread = Market willing to take risk. Bullish for alts.'
                : '🟡 Narrow spread = Risk aversion. Capital rotating to safety.'}
            </p>
          </div>

          {/* RWA Protocols */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              RWA Protocols (Institutional Money)
            </h3>
            <div className="space-y-2">
              {rwaProtocols.map((protocol) => (
                <div
                  key={protocol.name}
                  className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className={`h-5 w-5 ${
                        protocol.risk === 'low' ? 'text-green-500' :
                        protocol.risk === 'medium' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                      <div>
                        <p className="font-semibold text-white">{protocol.name}</p>
                        <p className="text-xs text-gray-400">{protocol.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        ${formatNumber(protocol.tvl / 1e6, 0)}M TVL
                      </p>
                      <p className="text-xs text-green-400">{protocol.yield.toFixed(1)}% APY</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-400">Content Signal</p>
                <p className="text-xs text-gray-400 mt-1">
                  {avgVelocity > 0.3
                    ? 'High stablecoin velocity = Real economic activity. Film: "Institutions Are Quietly Using Solana (PayFi is Here)"'
                    : 'Low velocity = Stablecoins sitting idle. Film: "Why Aren\'t Stablecoins Moving? (Market Analysis)"'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
