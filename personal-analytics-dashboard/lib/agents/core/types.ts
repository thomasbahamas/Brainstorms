// Core Agent Types and Interfaces

export type AgentDomain = 'macro' | 'content' | 'portfolio' | 'regulatory' | 'health'
export type AgentStatus = 'idle' | 'monitoring' | 'analyzing' | 'executing' | 'error'
export type AutonomyLevel = 'notify' | 'suggest' | 'execute'
export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'failed'

// Agent Configuration
export interface AgentConfig {
  id: string
  name: string
  description: string
  domain: AgentDomain
  capabilities: string[]
  autonomyLevel: AutonomyLevel
  enabled: boolean
  monitoringInterval: string // cron expression
}

// Agent Decision
export interface AgentDecision {
  id: string
  agentId: string
  timestamp: Date
  trigger: string
  reasoning: string
  confidence: number // 0-100
  dataPoints: Record<string, any>
  recommendedAction?: AgentAction
}

// Agent Action
export interface AgentAction {
  id: string
  agentId: string
  decisionId: string
  type: string
  description: string
  payload: Record<string, any>
  autonomyLevel: AutonomyLevel
  status: ActionStatus
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: Date
  executedAt?: Date
  result?: any
  error?: string
}

// Agent Event
export interface AgentEvent {
  id: string
  agentId: string
  type: 'monitoring' | 'decision' | 'action' | 'approval' | 'completion' | 'error'
  timestamp: Date
  data: Record<string, any>
  metadata?: Record<string, any>
}

// Agent State
export interface AgentState {
  agentId: string
  status: AgentStatus
  lastRun?: Date
  lastDecision?: AgentDecision
  lastAction?: AgentAction
  errorCount: number
  successCount: number
  metrics: {
    decisionsToday: number
    actionsToday: number
    approvalRate: number
    successRate: number
  }
}

// Base Agent Interface
export interface IAgent {
  config: AgentConfig
  state: AgentState

  // Core lifecycle methods
  initialize(): Promise<void>
  monitor(): Promise<AgentDecision | null>
  analyze(decision: AgentDecision): Promise<AgentAction | null>
  execute(action: AgentAction): Promise<any>
  shutdown(): Promise<void>

  // State management
  getState(): AgentState
  updateState(updates: Partial<AgentState>): void

  // Event handling
  emit(event: AgentEvent): void
  onEvent(type: string, handler: (event: AgentEvent) => void): void
}

// Tool Execution Result
export interface ToolResult<T = any> {
  success: boolean
  data?: T
  error?: string
  metadata?: Record<string, any>
}

// Available Tools
export interface AgentTools {
  // LLM
  generateText(prompt: string, options?: { model?: string; temperature?: number }): Promise<ToolResult<string>>
  generateJSON<T>(prompt: string, schema: any): Promise<ToolResult<T>>

  // Calendar
  getAvailability(date: Date, minDuration: number): Promise<ToolResult<Array<{ start: Date; end: Date }>>>
  bookEvent(event: { title: string; start: Date; end: Date; description?: string }): Promise<ToolResult<string>>

  // Notifications
  notify(channel: 'email' | 'slack' | 'telegram' | 'push', message: { subject?: string; body: string }): Promise<ToolResult<boolean>>

  // Blockchain (Solana)
  getWalletBalance(address: string): Promise<ToolResult<number>>
  executeSwap(params: { from: string; to: string; amount: number }): Promise<ToolResult<string>>

  // Research
  scrapeWeb(url: string): Promise<ToolResult<string>>
  searchWeb(query: string): Promise<ToolResult<Array<{ title: string; url: string; snippet: string }>>>

  // Content
  generateThumbnail(params: { text: string; style: string }): Promise<ToolResult<string>>
  draftYouTubeDescription(params: { title: string; content: string }): Promise<ToolResult<string>>

  // Database
  saveToNotion(database: string, page: any): Promise<ToolResult<string>>
  queryDatabase(database: string, filter: any): Promise<ToolResult<any[]>>
}

// Agent Approval Request
export interface ApprovalRequest {
  id: string
  agentId: string
  actionId: string
  title: string
  description: string
  risk: 'low' | 'medium' | 'high'
  impact: string
  data: Record<string, any>
  expiresAt: Date
  status: 'pending' | 'approved' | 'rejected' | 'expired'
}
