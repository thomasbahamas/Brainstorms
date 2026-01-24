'use client'

import { useState, useEffect, useCallback } from 'react'
import { SolanaWallet, TokenHolding, NFTHolding, DeFiPosition } from '@/types'
import { mockTokens } from '@/lib/mock-data'

interface UseSolanaWalletResult {
  wallet: SolanaWallet | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Mock NFT data for development
const mockNFTs: NFTHolding[] = [
  {
    mint: 'NFT111111111111111111111111111111111111111',
    name: 'Mad Lads #1234',
    collection: 'Mad Lads',
    imageUrl: 'https://madlads.s3.us-west-2.amazonaws.com/images/1234.png',
    floorPrice: 85.5,
  },
  {
    mint: 'NFT222222222222222222222222222222222222222',
    name: 'Tensorian #567',
    collection: 'Tensorians',
    imageUrl: 'https://tensorians.s3.us-west-2.amazonaws.com/images/567.png',
    floorPrice: 12.3,
  },
]

// Mock DeFi positions for development
const mockDeFiPositions: DeFiPosition[] = [
  {
    protocol: 'Marinade',
    type: 'staking',
    value: 5000,
    apy: 7.2,
    rewards: 45.5,
  },
  {
    protocol: 'Kamino',
    type: 'liquidity',
    value: 3500,
    apy: 15.8,
    rewards: 120,
  },
  {
    protocol: 'MarginFi',
    type: 'lending',
    value: 2000,
    apy: 8.5,
  },
]

/**
 * Custom hook to fetch Solana wallet data
 *
 * Currently uses mock data for development.
 * In production, this will connect to Solana RPC endpoints (Helius, QuickNode, etc.)
 * to fetch real wallet data including balance, tokens, NFTs, and DeFi positions.
 *
 * @param address - The Solana wallet address to fetch data for
 * @returns Object containing wallet data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * const { wallet, isLoading, error, refetch } = useSolanaWallet('7xKXtg...')
 *
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 * if (!wallet) return <ConnectWallet />
 *
 * return <WalletDisplay wallet={wallet} />
 * ```
 */
export function useSolanaWallet(address: string): UseSolanaWalletResult {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWalletData = useCallback(async () => {
    if (!address) {
      setWallet(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In production, replace this with actual Solana RPC calls:
      // 1. Fetch SOL balance: connection.getBalance(publicKey)
      // 2. Fetch token accounts: connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })
      // 3. Fetch NFTs: Use Metaplex or Helius API
      // 4. Fetch DeFi positions: Query protocol-specific APIs (Marinade, Kamino, etc.)

      // Simulate network delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 500))

      // Calculate total SOL balance from mock tokens
      const solToken = mockTokens.find(t => t.symbol === 'SOL')
      const solBalance = solToken?.balance ?? 0

      const walletData: SolanaWallet = {
        address,
        balance: solBalance,
        tokens: mockTokens,
        nfts: mockNFTs,
        defiPositions: mockDeFiPositions,
      }

      setWallet(walletData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch wallet data'))
      setWallet(null)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchWalletData()
  }, [fetchWalletData])

  return {
    wallet,
    isLoading,
    error,
    refetch: fetchWalletData,
  }
}
