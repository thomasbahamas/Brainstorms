import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Video,
  Heart,
  Globe,
  CheckSquare,
  DollarSign,
  Brain,
  MessageSquare,
  Shield,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export interface AppModule {
  id: string
  name: string
  shortName: string
  description: string
  icon: LucideIcon
  gradient: string
  href: string
  category: "tactical" | "strategic" | "personal" | "system"
  status: "active" | "beta" | "coming-soon"
  stats?: { label: string; value: string }[]
}

export const MODULE_REGISTRY: AppModule[] = [
  {
    id: "dashboard",
    name: "Command Center",
    shortName: "Home",
    description: "Unified overview of all modules",
    icon: LayoutDashboard,
    gradient: "from-purple-500 to-pink-500",
    href: "/",
    category: "system",
    status: "active",
  },
  {
    id: "crypto",
    name: "Crypto Intelligence",
    shortName: "Crypto",
    description: "Wallet, tokens, narratives, airdrops, trading signals",
    icon: Wallet,
    gradient: "from-purple-500 to-indigo-500",
    href: "/crypto",
    category: "tactical",
    status: "active",
  },
  {
    id: "macro",
    name: "Macro Intelligence",
    shortName: "Macro",
    description: "M2 liquidity, banana zone, global macro signals",
    icon: TrendingUp,
    gradient: "from-yellow-500 to-orange-500",
    href: "/macro",
    category: "strategic",
    status: "active",
  },
  {
    id: "content",
    name: "Content Engine",
    shortName: "Content",
    description: "Video ideas, narrative triggers, content calendar",
    icon: Video,
    gradient: "from-blue-500 to-cyan-500",
    href: "/content",
    category: "tactical",
    status: "active",
  },
  {
    id: "health",
    name: "Health & Performance",
    shortName: "Health",
    description: "Fitness tracking, habits, wellness metrics",
    icon: Heart,
    gradient: "from-green-500 to-emerald-500",
    href: "/health",
    category: "personal",
    status: "active",
  },
  {
    id: "regulatory",
    name: "Regulatory Radar",
    shortName: "Legal",
    description: "Jurisdiction analysis, DFAL countdown, compliance",
    icon: Shield,
    gradient: "from-red-500 to-orange-500",
    href: "/regulatory",
    category: "strategic",
    status: "active",
  },
  {
    id: "rwa",
    name: "Real Money Workstation",
    shortName: "RWA",
    description: "Stablecoins, RWA protocols, yield analysis",
    icon: BarChart3,
    gradient: "from-emerald-500 to-teal-500",
    href: "/rwa",
    category: "strategic",
    status: "active",
  },
  {
    id: "tasks",
    name: "Mission Control",
    shortName: "Tasks",
    description: "Projects, tasks, goals, and daily operations",
    icon: CheckSquare,
    gradient: "from-violet-500 to-purple-500",
    href: "/tasks",
    category: "personal",
    status: "active",
  },
  {
    id: "finance",
    name: "Treasury",
    shortName: "Finance",
    description: "Budget, income, expenses, net worth tracking",
    icon: DollarSign,
    gradient: "from-amber-500 to-yellow-500",
    href: "/finance",
    category: "personal",
    status: "active",
  },
  {
    id: "knowledge",
    name: "Second Brain",
    shortName: "Knowledge",
    description: "Notes, bookmarks, research, idea capture",
    icon: Brain,
    gradient: "from-pink-500 to-rose-500",
    href: "/knowledge",
    category: "personal",
    status: "active",
  },
  {
    id: "comms",
    name: "Comms Hub",
    shortName: "Comms",
    description: "Unified notifications, messages, social feed",
    icon: MessageSquare,
    gradient: "from-sky-500 to-blue-500",
    href: "/comms",
    category: "tactical",
    status: "active",
  },
]

export function getModule(id: string): AppModule | undefined {
  return MODULE_REGISTRY.find((m) => m.id === id)
}

export function getModulesByCategory(category: AppModule["category"]): AppModule[] {
  return MODULE_REGISTRY.filter((m) => m.category === category)
}
