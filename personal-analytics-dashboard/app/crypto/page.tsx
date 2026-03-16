"use client"

import { getModule } from "@/lib/protocol"
import { ModuleLayout } from "@/components/unified/module-layout"
import { WalletOverview } from "@/components/solana/wallet-overview"
import { TokenHoldings } from "@/components/solana/token-holdings"
import { NarrativesTracker } from "@/components/crypto/narratives-tracker"
import { AirdropTracker } from "@/components/crypto/airdrop-tracker"
import { TradingSignals } from "@/components/crypto/trading-signals"
import { HotTopics } from "@/components/trends/hot-topics"
import { useLiveWallet } from "@/lib/hooks/use-solana"
import {
  mockTokens,
  mockNarratives,
  mockAirdrops,
  mockSignals,
  mockTopics,
} from "@/lib/mock-data"

// Set your wallet address here or via env var
const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

export default function CryptoPage() {
  const mod = getModule("crypto")!
  const { data: liveWallet, isLoading, lastUpdated } = useLiveWallet(WALLET_ADDRESS)

  // Use live data if available, otherwise fall back to mock
  const isLive = !!liveWallet
  const address = liveWallet?.address || WALLET_ADDRESS
  const solBalance = liveWallet?.solBalance ?? 125.5
  const usdValue = liveWallet?.solUsdValue ?? 18825
  const change24h = liveWallet?.tokens[0]?.change24h ?? 5.2
  const tokens = liveWallet?.tokens ?? mockTokens

  return (
    <ModuleLayout module={mod}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletOverview
            address={address}
            balance={solBalance}
            usdValue={usdValue}
            change24h={change24h}
            isLive={isLive}
            lastUpdated={lastUpdated}
          />
          <TokenHoldings tokens={tokens} isLoading={isLoading} />
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
