# Personal Analytics Command Center v3.0 🤖

**The Agentic Shift: From Passive Dashboard to Autonomous Workforce**

"In an agentic world, apps become passive databases while AI agents hold the intelligence, make decisions & do the work." — Satya Nadella

![Dashboard](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Agents](https://img.shields.io/badge/Agents-5-purple?style=for-the-badge&logo=robot)

## What's New in v3.0 🚀

**The Agentic Layer** — Autonomous agents that work while you sleep:

### 🤖 Autonomous Agents (NEW!)
- **Macro Analyst Agent**: Monitors M2 liquidity, auto-generates video scripts, books filming slots
- **Event-Driven Runtime**: Cron-based scheduling, action queue, approval workflow
- **Tool Integration**: LLMs, Calendar, Blockchain, Notifications, Content Gen
- **Real-Time Monitoring**: Dashboard shows agent status, pending actions, event logs
- **3 Autonomy Levels**: Notify → Suggest → Execute

[**→ Full Agent Documentation**](./AGENTS.md)

## Previous Updates (v2.0)

**Strategic Intelligence Layer** — The difference between tracking *what's happening* and understanding *why it's happening*:

### 🍌 The Banana Zone (Macro Intelligence)
- **M2 Liquidity Tracking**: Live Federal Reserve M2 money supply data via FRED API
- **Leading Indicator**: Historically predicts crypto repricing events 3-6 months in advance
- **Raoul Pal Thesis**: Visualize the "liquidity wave" that drives institutional capital flows

### 🛡️ Regulatory Command Center
- **Traffic Light System**: Instant clarity on jurisdictions (Safe/Caution/Restricted)
- **DFAL Countdown**: Days until California's Digital Financial Assets Law enforcement
- **Strategic Moves**: Wyoming LLC? Dubai residency? Make informed decisions
- **Content Angles**: Auto-generated video ideas from regulatory trends

### 💰 Real Money Workstation
- **Stablecoin Velocity**: Track USDC/USDT/PYUSD supply and movement on Solana
- **PayFi Signal**: Differentiate casino volume from real economic activity
- **Yield Spread Analysis**: DeFi yield vs. risk-free RWA rate (market sentiment indicator)
- **RWA Protocol Tracking**: Monitor Ondo, Maple, Centrifuge TVL and yields

### ✨ Script-to-Screen AI Triggers
- **Auto-Generated Video Ideas**: Based on live macro, stablecoin, and sentiment data
- **Urgency Levels**: High/medium/low priority based on data signals
- **Hook Suggestions**: Pre-written video hooks matched to current narratives
- **Trendiness Scoring**: Algorithmic view projections for each idea

## Overview

This command center combines tactical and strategic modules:

**Tactical (Day-to-Day):**
- Track Solana wallet assets and DeFi positions
- Monitor crypto market narratives and trends
- Discover and track airdrop opportunities
- Identify trading signals and opportunities
- Plan content strategy for Solana Floor
- Track health and fitness metrics

**Strategic (Big Picture):**
- Global M2 liquidity trends (the "why" behind price movements)
- Regulatory landscape navigation (where you can operate)
- Real money flows vs. casino volume (institutional signals)
- Automated narrative triggers (data-driven content strategy)

## Features

### 🔮 Solana Analytics
- **Wallet Overview**: Real-time SOL balance and USD value tracking
- **Token Holdings**: Complete portfolio view with 24h price changes
- **NFT Portfolio**: Track your NFT collections and floor prices
- **DeFi Positions**: Monitor lending, staking, and LP positions

### 🔥 Market Intelligence
- **Crypto Narratives**: Track trending narratives (AI, DeFi, RWA, etc.)
- **Hot Topics**: Real-time social sentiment and trending topics
- **Volume & Sentiment Analysis**: Data-driven insights

### 💎 Opportunity Tracking
- **Airdrop Tracker**: Monitor active airdrop campaigns with:
  - Estimated value and effort level
  - Progress tracking
  - Requirements checklist
  - Deadlines
- **Trading Signals**: AI-powered trading recommendations with:
  - Entry/exit prices
  - Stop-loss levels
  - Confidence scores
  - Reasoning

### 📺 Content Strategy (Solana Floor)
- **Video Ideas Pipeline**: Organize and prioritize video content
- **Trendiness Score**: Algorithmic scoring based on market trends
- **Estimated Views**: Data-driven view projections
- **Production Status**: Track from idea → planning → filming → editing → published
- **Hook Generation**: AI-suggested video hooks
- **Narrative Alignment**: Connect content to trending narratives

### 💪 Health & Fitness
- **Daily Metrics**: Weight, steps, sleep, water intake, calories
- **Workout Logging**: Type, duration, intensity, calories burned
- **Streak Tracking**: Maintain consistency with daily streaks
- **Progress Visualization**: Charts and progress bars

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Blockchain**: Solana Web3.js
- **Charts**: Recharts
- **State Management**: React Hooks + Context API

## Project Structure

```
personal-analytics-dashboard/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Base UI components
│   │   └── card.tsx
│   ├── dashboard/          # Dashboard components
│   │   └── stats-overview.tsx
│   ├── solana/             # Solana-specific components
│   │   ├── wallet-overview.tsx
│   │   └── token-holdings.tsx
│   ├── crypto/             # Crypto analytics
│   │   ├── narratives-tracker.tsx
│   │   ├── airdrop-tracker.tsx
│   │   └── trading-signals.tsx
│   ├── trends/             # Trending topics
│   │   └── hot-topics.tsx
│   ├── content/            # Content strategy
│   │   └── video-ideas.tsx
│   └── health/             # Health tracking
│       └── fitness-tracker.tsx
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── mock-data.ts        # Mock data for development
│   ├── solana/             # Solana integration
│   └── api/                # API integrations
├── types/
│   └── index.ts            # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Solana RPC Endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# CoinGecko API (for price data)
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key

# Twitter/X API (for social sentiment)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret

# Optional: Custom APIs for trading signals, narratives, etc.
CUSTOM_API_ENDPOINT=your_endpoint
```

## Customization

### Adding Your Wallet

Update the wallet address in `app/page.tsx`:

```typescript
<WalletOverview
  address="YOUR_SOLANA_WALLET_ADDRESS"
  balance={125.5}
  usdValue={18825}
  change24h={5.2}
/>
```

### Modifying Mock Data

Edit `lib/mock-data.ts` to customize the sample data displayed in the dashboard.

### Connecting Real Data

Replace mock data with real API calls:

1. Create API integration in `lib/api/`
2. Create custom hooks in `hooks/`
3. Update components to use real data

Example:
```typescript
// hooks/useSolanaWallet.ts
export function useSolanaWallet(address: string) {
  // Fetch real wallet data from Solana RPC
  // Return wallet balance, tokens, NFTs, etc.
}
```

## Roadmap

### Phase 1: Foundation (Current)
- [x] Core dashboard UI
- [x] All module components
- [x] Mock data integration
- [x] Responsive design

### Phase 2: Live Data Integration
- [ ] Connect Solana RPC for real wallet data
- [ ] Integrate CoinGecko for price feeds
- [ ] Add social sentiment APIs
- [ ] Implement airdrop tracking APIs

### Phase 3: Advanced Features
- [ ] User authentication
- [ ] Data persistence (database)
- [ ] Custom alerts and notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered insights

### Phase 4: Automation
- [ ] Automated airdrop task execution
- [ ] Trading bot integration
- [ ] Content scheduling automation
- [ ] Health data sync (Apple Health, Google Fit)

## API Integrations (Future)

### Planned Integrations
- **Solana**: Helius, QuickNode, or custom RPC
- **Prices**: CoinGecko, CoinMarketCap
- **Social**: Twitter API, Discord webhooks
- **Analytics**: Dune Analytics, Flipside Crypto
- **Health**: Apple Health, Google Fit, Fitbit
- **Content**: YouTube Analytics API

## Contributing

This is a personal dashboard, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Security

- Never commit API keys or private keys
- Use environment variables for sensitive data
- Keep dependencies updated
- Review security advisories regularly

## Performance

The dashboard is optimized for performance:
- Server-side rendering with Next.js
- Lazy loading for heavy components
- Efficient React rendering with proper memoization
- Tailwind CSS for minimal bundle size

## License

MIT License - feel free to use this for your own personal dashboard!

## Acknowledgments

Built with:
- Next.js & React
- Tailwind CSS
- Solana Web3.js
- Lucide Icons
- Recharts

---

**Built for maximizing productivity, alpha hunting, and personal growth** 🚀
