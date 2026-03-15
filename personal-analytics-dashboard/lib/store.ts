import { create } from "zustand"

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
  priority: "critical" | "high" | "medium" | "low"
  module?: string
  dueDate?: string
  tags: string[]
  createdAt: string
}

export interface FinanceEntry {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  recurring?: boolean
}

export interface KnowledgeNote {
  id: string
  title: string
  content: string
  category: "note" | "bookmark" | "idea" | "research"
  tags: string[]
  url?: string
  createdAt: string
  pinned: boolean
}

export interface CommMessage {
  id: string
  platform: "twitter" | "youtube" | "discord" | "telegram" | "email"
  from: string
  subject: string
  preview: string
  timestamp: string
  read: boolean
  priority: "high" | "normal" | "low"
  actionRequired: boolean
}

interface AppState {
  activeModule: string
  commandPaletteOpen: boolean
  sidebarCollapsed: boolean

  tasks: Task[]
  finances: FinanceEntry[]
  notes: KnowledgeNote[]
  messages: CommMessage[]

  setActiveModule: (id: string) => void
  toggleCommandPalette: () => void
  toggleSidebar: () => void

  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  addFinanceEntry: (entry: FinanceEntry) => void
  deleteFinanceEntry: (id: string) => void

  addNote: (note: KnowledgeNote) => void
  updateNote: (id: string, updates: Partial<KnowledgeNote>) => void
  deleteNote: (id: string) => void
  togglePinNote: (id: string) => void

  markMessageRead: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: "dashboard",
  commandPaletteOpen: false,
  sidebarCollapsed: false,

  tasks: [
    {
      id: "t1",
      title: "Film Solana Airdrop Guide",
      description: "Top 5 Solana airdrops farming guide - script is ready",
      status: "in-progress",
      priority: "critical",
      module: "content",
      dueDate: "2026-03-20",
      tags: ["youtube", "solana", "airdrops"],
      createdAt: "2026-03-10",
    },
    {
      id: "t2",
      title: "Rebalance SOL-USDC position on Kamino",
      description: "IL is getting high, need to rebalance or pull liquidity",
      status: "todo",
      priority: "high",
      module: "crypto",
      dueDate: "2026-03-16",
      tags: ["defi", "kamino", "urgent"],
      createdAt: "2026-03-12",
    },
    {
      id: "t3",
      title: "Review Wyoming LLC formation docs",
      description: "Lawyer sent updated operating agreement",
      status: "todo",
      priority: "high",
      module: "regulatory",
      tags: ["legal", "llc", "wyoming"],
      createdAt: "2026-03-13",
    },
    {
      id: "t4",
      title: "Set up M2 data alerts",
      description: "Configure FRED API alerts for M2 supply changes >2%",
      status: "done",
      priority: "medium",
      module: "macro",
      tags: ["macro", "automation"],
      createdAt: "2026-03-08",
    },
    {
      id: "t5",
      title: "Hit 15-day workout streak",
      description: "3 more days to go - don't break it",
      status: "in-progress",
      priority: "medium",
      module: "health",
      tags: ["fitness", "streak"],
      createdAt: "2026-03-01",
    },
    {
      id: "t6",
      title: "Research AI Agent protocols for video",
      description: "Deep dive into VIRTUAL, AI16Z, ZEREBRO for script",
      status: "todo",
      priority: "high",
      module: "content",
      tags: ["research", "ai-agents"],
      createdAt: "2026-03-14",
    },
    {
      id: "t7",
      title: "Quarterly tax prep",
      description: "Gather crypto transactions for Q1 2026 estimated taxes",
      status: "todo",
      priority: "critical",
      module: "finance",
      dueDate: "2026-04-15",
      tags: ["taxes", "q1", "crypto"],
      createdAt: "2026-03-15",
    },
  ],

  finances: [
    { id: "f1", type: "income", category: "YouTube AdSense", amount: 4200, description: "February 2026 revenue", date: "2026-03-01", recurring: true },
    { id: "f2", type: "income", category: "Sponsorship", amount: 3500, description: "Phantom wallet integration", date: "2026-03-05" },
    { id: "f3", type: "income", category: "Staking Rewards", amount: 890, description: "SOL staking + JitoSOL MEV", date: "2026-03-10", recurring: true },
    { id: "f4", type: "income", category: "Airdrop", amount: 2100, description: "Kamino Season 2 partial claim", date: "2026-03-08" },
    { id: "f5", type: "expense", category: "Equipment", amount: 1200, description: "New camera lens for studio", date: "2026-03-03" },
    { id: "f6", type: "expense", category: "Software", amount: 89, description: "Premiere Pro + thumbnail tools", date: "2026-03-01", recurring: true },
    { id: "f7", type: "expense", category: "Living", amount: 2800, description: "Rent + utilities", date: "2026-03-01", recurring: true },
    { id: "f8", type: "expense", category: "Crypto Gas", amount: 45, description: "Solana transaction fees", date: "2026-03-12" },
    { id: "f9", type: "expense", category: "Food", amount: 650, description: "Groceries + dining", date: "2026-03-15" },
    { id: "f10", type: "income", category: "Consulting", amount: 1500, description: "DeFi advisory session", date: "2026-03-14" },
  ],

  notes: [
    {
      id: "n1",
      title: "Banana Zone Thesis - Raoul Pal",
      content: "M2 money supply expansion leads crypto repricing by 3-6 months. When M2 goes vertical, BTC and alts follow. Key metric: M2 YoY change crossing above 5%. We're currently at the inflection point.",
      category: "research",
      tags: ["macro", "m2", "raoul-pal", "thesis"],
      createdAt: "2026-02-20",
      pinned: true,
    },
    {
      id: "n2",
      title: "AI Agent Landscape Map",
      content: "VIRTUAL - AI agent launchpad, market leader. AI16Z - DAO-managed fund using AI agents. ZEREBRO - autonomous AI content creator. Key insight: the meta is shifting from memecoins to AI utility tokens. Content angle: compare AI agent platforms by TVL, usage, and token performance.",
      category: "research",
      tags: ["ai-agents", "research", "content-idea"],
      createdAt: "2026-03-10",
      pinned: true,
    },
    {
      id: "n3",
      title: "Wyoming vs Florida LLC comparison",
      content: "Wyoming: 0% state income tax, strong privacy, Series LLC option, crypto-friendly legislation (DAO LLC Act). Florida: 0% state income tax, no asset protection by default, more established. Verdict: Wyoming for crypto, Florida for lifestyle. Consider splitting: Wyoming LLC + Florida residence.",
      category: "note",
      tags: ["legal", "llc", "jurisdiction"],
      createdAt: "2026-03-05",
      pinned: false,
    },
    {
      id: "n4",
      title: "Video Hook Formula",
      content: "Pattern: [Shocking stat] + [Emotional trigger] + [Personal angle]. Example: '$2.3B just flowed into Solana DeFi (I'm positioning NOW)'. Top performers: urgency + data + personal stake. Avoid: clickbait without substance, outdated data.",
      category: "idea",
      tags: ["content", "youtube", "hooks"],
      createdAt: "2026-03-01",
      pinned: false,
    },
    {
      id: "n5",
      title: "Stablecoin Velocity as Leading Indicator",
      content: "When stablecoin velocity increases alongside rising supply, it signals genuine economic activity not just speculation. Track USDC velocity on Solana specifically. Compare vs. memecoin volume to distinguish 'real' vs 'casino' activity.",
      category: "research",
      tags: ["stablecoins", "macro", "indicator"],
      createdAt: "2026-02-28",
      pinned: true,
    },
    {
      id: "n6",
      title: "Thumbnail A/B test results",
      content: "Red backgrounds outperform blue by 23% CTR. Faces with surprised expressions get 2x clicks. Number-based titles ('Top 5', '3 Reasons') outperform question titles by 15%. Best combo: red bg + face + number title.",
      category: "note",
      tags: ["youtube", "thumbnails", "data"],
      createdAt: "2026-03-12",
      pinned: false,
    },
  ],

  messages: [
    { id: "m1", platform: "youtube", from: "YouTube Studio", subject: "Video Performance Alert", preview: "Your video 'Solana Airdrops Guide' hit 50K views in 48 hours", timestamp: "2026-03-15T08:30:00Z", read: false, priority: "high", actionRequired: false },
    { id: "m2", platform: "email", from: "Phantom Wallet", subject: "Sponsorship Renewal", preview: "We'd like to continue our partnership for Q2. New terms attached.", timestamp: "2026-03-15T07:15:00Z", read: false, priority: "high", actionRequired: true },
    { id: "m3", platform: "twitter", from: "@aeyakovenko", subject: "Mentioned you", preview: "Great analysis on the Solana DeFi ecosystem in your latest...", timestamp: "2026-03-14T22:00:00Z", read: false, priority: "high", actionRequired: false },
    { id: "m4", platform: "discord", from: "Solana Floor Community", subject: "Mod Alert", preview: "3 new spam accounts detected, requires mod action", timestamp: "2026-03-15T06:00:00Z", read: true, priority: "normal", actionRequired: true },
    { id: "m5", platform: "telegram", from: "DeFi Alpha Group", subject: "New Farming Opportunity", preview: "New Marinade Finance vault launched with 18% APY. Early bird bonus active.", timestamp: "2026-03-15T05:45:00Z", read: false, priority: "normal", actionRequired: false },
    { id: "m6", platform: "email", from: "CPA - Sarah Chen", subject: "Q1 Tax Estimates", preview: "Based on your crypto activity, estimated Q1 liability is...", timestamp: "2026-03-14T16:00:00Z", read: true, priority: "high", actionRequired: true },
    { id: "m7", platform: "youtube", from: "Collab Request", subject: "Joint Video Proposal", preview: "Hey! I run a 200K sub channel focused on DeFi. Would love to...", timestamp: "2026-03-14T14:30:00Z", read: false, priority: "normal", actionRequired: true },
  ],

  setActiveModule: (id) => set({ activeModule: id }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  addFinanceEntry: (entry) => set((s) => ({ finances: [...s.finances, entry] })),
  deleteFinanceEntry: (id) => set((s) => ({ finances: s.finances.filter((f) => f.id !== id) })),

  addNote: (note) => set((s) => ({ notes: [...s.notes, note] })),
  updateNote: (id, updates) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
  togglePinNote: (id) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    })),

  markMessageRead: (id) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
    })),
}))
