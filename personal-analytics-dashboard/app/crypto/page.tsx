"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { WalletOverview } from "@/components/solana/wallet-overview"
import { TokenHoldings } from "@/components/solana/token-holdings"
import { NarrativesTracker } from "@/components/crypto/narratives-tracker"
import { AirdropTracker } from "@/components/crypto/airdrop-tracker"
import { TradingSignals } from "@/components/crypto/trading-signals"
import { HotTopics } from "@/components/trends/hot-topics"
import {
  mockTokens,
  mockNarratives,
  mockAirdrops,
  mockSignals,
  mockTopics,
} from "@/lib/mock-data"

export default function CryptoPage() {
  const mod = getModule("crypto")!

  return (
    <ModuleLayout module={mod}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletOverview
            address="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
            balance={125.5}
            usdValue={18825}
            change24h={5.2}
          />
          <TokenHoldings tokens={mockTokens} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NarrativesTracker narratives={mockNarratives} />
          <AirdropTracker airdrops={mockAirdrops} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingSignals signals={mockSignals} />
          <HotTopics topics={mockTopics} />
        </div>
      </div>
    </ModuleLayout>
  )
}
