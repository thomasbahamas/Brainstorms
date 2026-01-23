'use client'

import { StatsOverview } from "@/components/dashboard/stats-overview"
import { WalletOverview } from "@/components/solana/wallet-overview"
import { TokenHoldings } from "@/components/solana/token-holdings"
import { NarrativesTracker } from "@/components/crypto/narratives-tracker"
import { AirdropTracker } from "@/components/crypto/airdrop-tracker"
import { TradingSignals } from "@/components/crypto/trading-signals"
import { HotTopics } from "@/components/trends/hot-topics"
import { VideoIdeas } from "@/components/content/video-ideas"
import { NarrativeTriggers } from "@/components/content/narrative-triggers"
import { FitnessTracker } from "@/components/health/fitness-tracker"
import { BananaZoneChart } from "@/components/macro/banana-zone-chart"
import { RegulatoryCommandCenter } from "@/components/regulatory/regulatory-command-center"
import { RealMoneyWorkstation } from "@/components/rwa/real-money-workstation"
import { AgentMonitor } from "@/components/agents/agent-monitor"
import {
  mockTokens,
  mockNarratives,
  mockAirdrops,
  mockSignals,
  mockTopics,
  mockVideoIdeas,
  mockHealthMetrics,
  mockDashboardStats,
} from "@/lib/mock-data"
import { Activity, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Personal Analytics</h1>
                <p className="text-xs text-gray-400">v3.0 Agentic</p>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden lg:flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 px-4 py-2">
                <p className="text-xs text-gray-400">Solana Floor Creator</p>
                <p className="text-sm font-semibold text-white">Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard Stats */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <StatsOverview stats={mockDashboardStats} />
          </section>

          {/* Agentic Layer - THE VALUE LAYER */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                🤖 Autonomous Agents: The Agentic Layer
              </span>
            </h2>
            <AgentMonitor />
          </section>

          {/* Macro Intelligence - THE BIG PICTURE */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🍌 Macro Intelligence: The Big Picture
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BananaZoneChart />
              <RegulatoryCommandCenter />
            </div>
          </section>

          {/* Crypto Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Solana Analytics
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WalletOverview
                address="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                balance={125.5}
                usdValue={18825}
                change24h={5.2}
              />
              <TokenHoldings tokens={mockTokens} />
            </div>
          </section>

          {/* Narratives & Airdrops */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Market Intelligence
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <NarrativesTracker narratives={mockNarratives} />
              <AirdropTracker airdrops={mockAirdrops} />
            </div>
            {/* Real Money Section */}
            <RealMoneyWorkstation />
          </section>

          {/* Trading & Topics */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingSignals signals={mockSignals} />
              <HotTopics topics={mockTopics} />
            </div>
          </section>

          {/* Content Strategy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Solana Floor Content Strategy
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <NarrativeTriggers />
              <VideoIdeas ideas={mockVideoIdeas} />
            </div>
          </section>

          {/* Health & Fitness */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Health & Fitness
              </span>
            </h2>
            <div className="max-w-2xl">
              <FitnessTracker metrics={mockHealthMetrics} weeklyStreak={12} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Personal Analytics Command Center v2.0 • From Trader Dashboard to Media Mogul HQ</p>
            <p className="mt-2">Track Macro • Navigate Regulation • Build Content Empire • Stay Healthy</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
