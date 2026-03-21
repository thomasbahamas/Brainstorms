"use client"

import { useQuery } from "@tanstack/react-query"
import { TokenHolding } from "@/types"

const SOL_MINT = "So11111111111111111111111111111111111111112"

interface WalletResponse {
  address: string
  solBalance: number
  tokens: Array<{
    mint: string
    symbol: string
    name: string
    balance: number
  }>
  fetchedAt: string
}

interface PriceResponse {
  prices: Record<string, { price: number; change24h: number | null }>
  fetchedAt: string
}

export interface LiveWalletData {
  address: string
  solBalance: number
  solPrice: number
  solUsdValue: number
  tokens: TokenHolding[]
  totalValue: number
  fetchedAt: string
}

// Fetch wallet balances
function useWalletBalances(address: string | null) {
  return useQuery<WalletResponse>({
    queryKey: ["wallet", address],
    queryFn: async () => {
      const res = await fetch(`/api/solana/wallet?address=${address}`)
      if (!res.ok) throw new Error("Failed to fetch wallet")
      return res.json()
    },
    enabled: !!address,
    refetchInterval: 30_000, // every 30s
    staleTime: 15_000,
    retry: 2,
  })
}

// Fetch prices for given mints
function usePrices(mints: string[]) {
  const mintStr = mints.join(",")
  return useQuery<PriceResponse>({
    queryKey: ["prices", mintStr],
    queryFn: async () => {
      const res = await fetch(`/api/solana/prices?mints=${mintStr}`)
      if (!res.ok) throw new Error("Failed to fetch prices")
      return res.json()
    },
    enabled: mints.length > 0,
    refetchInterval: 30_000, // every 30s
    staleTime: 10_000,
    retry: 2,
  })
}

// Combined hook: wallet + prices -> enriched token list
export function useLiveWallet(address: string | null): {
  data: LiveWalletData | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  lastUpdated: string | null
} {
  const wallet = useWalletBalances(address)

  // Build mint list from wallet response
  const mints = [SOL_MINT, ...(wallet.data?.tokens.map((t) => t.mint) || [])]
  const prices = usePrices(wallet.data ? mints : [])

  if (!address) {
    return { data: null, isLoading: false, isError: false, error: null, lastUpdated: null }
  }

  if (wallet.isLoading || prices.isLoading) {
    return { data: null, isLoading: true, isError: false, error: null, lastUpdated: null }
  }

  if (wallet.isError) {
    return {
      data: null,
      isLoading: false,
      isError: true,
      error: wallet.error as Error,
      lastUpdated: null,
    }
  }

  const walletData = wallet.data!
  const priceData = prices.data?.prices || {}

  const solPrice = priceData[SOL_MINT]?.price || 0
  const solUsdValue = walletData.solBalance * solPrice

  // Build enriched token list
  const tokens: TokenHolding[] = [
    {
      mint: SOL_MINT,
      symbol: "SOL",
      name: "Solana",
      balance: walletData.solBalance,
      usdValue: solUsdValue,
      price: solPrice,
      change24h: priceData[SOL_MINT]?.change24h ?? 0,
    },
    ...walletData.tokens
      .filter((t) => t.mint !== SOL_MINT)
      .map((t) => {
        const p = priceData[t.mint]
        const price = p?.price || 0
        return {
          mint: t.mint,
          symbol: t.symbol,
          name: t.name,
          balance: t.balance,
          usdValue: t.balance * price,
          price,
          change24h: p?.change24h ?? 0,
        }
      })
      .sort((a, b) => b.usdValue - a.usdValue), // sort by value descending
  ]

  const totalValue = tokens.reduce((sum, t) => sum + t.usdValue, 0)

  return {
    data: {
      address: walletData.address,
      solBalance: walletData.solBalance,
      solPrice,
      solUsdValue,
      tokens,
      totalValue,
      fetchedAt: walletData.fetchedAt,
    },
    isLoading: false,
    isError: false,
    error: null,
    lastUpdated: walletData.fetchedAt,
  }
}
