// Solana Types
export interface SolanaWallet {
  address: string
  balance: number
  tokens: TokenHolding[]
  nfts: NFTHolding[]
  defiPositions: DeFiPosition[]
}

export interface TokenHolding {
  mint: string
  symbol: string
  name: string
  balance: number
  usdValue: number
  price: number
  change24h: number
  logoUrl?: string
}

export interface NFTHolding {
  mint: string
  name: string
  collection: string
  imageUrl: string
  floorPrice: number
}

export interface DeFiPosition {
  protocol: string
  type: 'lending' | 'liquidity' | 'staking' | 'farming'
  value: number
  apy: number
  rewards?: number
}

// Crypto Narratives
export interface CryptoNarrative {
  id: string
  name: string
  category: string
  trending: boolean
  sentiment: 'bullish' | 'neutral' | 'bearish'
  marketCap: number
  change7d: number
  topProjects: string[]
  description: string
}

// Airdrop/Yield Opportunities
export interface AirdropOpportunity {
  id: string
  protocol: string
  chain: string
  category: string
  estimatedValue: number
  effort: 'low' | 'medium' | 'high'
  deadline?: string
  requirements: string[]
  status: 'active' | 'upcoming' | 'completed'
  userProgress?: number
}

// Trading Signals
export interface TradingSignal {
  id: string
  token: string
  signal: 'buy' | 'sell' | 'hold'
  confidence: number
  price: number
  targetPrice: number
  stopLoss: number
  reasoning: string
  timestamp: Date
}

// Hot Topics
export interface HotTopic {
  id: string
  topic: string
  category: string
  volume: number
  sentiment: number
  trending: 'up' | 'down' | 'stable'
  mentions24h: number
  keyInfluencers: string[]
  relatedTokens: string[]
}

// Content Strategy
export interface VideoIdea {
  id: string
  title: string
  topic: string
  priority: 'high' | 'medium' | 'low'
  estimatedViews: number
  trendinessScore: number
  relatedNarratives: string[]
  hooks: string[]
  keyPoints: string[]
  deadline?: string
  status: 'idea' | 'planned' | 'filming' | 'editing' | 'published'
}

// Health & Fitness
export interface HealthMetrics {
  date: string
  weight?: number
  steps?: number
  sleep?: number
  calories?: number
  water?: number
  workout?: WorkoutSession
}

export interface WorkoutSession {
  type: string
  duration: number
  intensity: 'low' | 'medium' | 'high'
  caloriesBurned: number
  notes?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalPortfolioValue: number
  portfolioChange24h: number
  activeAirdrops: number
  pendingOpportunities: number
  healthStreak: number
  contentIdeas: number
}
