import { nanoid } from 'nanoid'
import { eventBus } from './event-bus'
import {
  IAgent,
  AgentConfig,
  AgentState,
  AgentEvent,
  AgentDecision,
  AgentAction,
} from './types'
import { tools } from '../tools'

export abstract class BaseAgent implements IAgent {
  config: AgentConfig
  state: AgentState
  protected tools = tools

  constructor(config: Omit<AgentConfig, 'id'>) {
    this.config = {
      id: nanoid(),
      ...config,
    }

    this.state = {
      agentId: this.config.id,
      status: 'idle',
      errorCount: 0,
      successCount: 0,
      metrics: {
        decisionsToday: 0,
        actionsToday: 0,
        approvalRate: 0,
        successRate: 0,
      },
    }
  }

  // === Abstract Methods (must be implemented by subclasses) ===

  abstract monitor(): Promise<AgentDecision | null>
  abstract analyze(decision: AgentDecision): Promise<AgentAction | null>
  abstract execute(action: AgentAction): Promise<any>

  // === Lifecycle Methods ===

  async initialize(): Promise<void> {
    console.log(`🔧 Initializing ${this.config.name}...`)
    // Subclasses can override to add custom initialization
  }

  async shutdown(): Promise<void> {
    console.log(`🔌 Shutting down ${this.config.name}...`)
    // Subclasses can override to add custom cleanup
  }

  // === State Management ===

  getState(): AgentState {
    return { ...this.state }
  }

  updateState(updates: Partial<AgentState>): void {
    this.state = {
      ...this.state,
      ...updates,
    }
  }

  // === Event Handling ===

  emit(event: AgentEvent): void {
    eventBus.emitAgentEvent(event)
  }

  onEvent(type: string, handler: (event: AgentEvent) => void): void {
    eventBus.subscribe(type as any, handler)
  }

  // === Helper Methods ===

  protected createDecision(
    trigger: string,
    reasoning: string,
    confidence: number,
    dataPoints: Record<string, any>
  ): AgentDecision {
    const decision: AgentDecision = {
      id: nanoid(),
      agentId: this.config.id,
      timestamp: new Date(),
      trigger,
      reasoning,
      confidence,
      dataPoints,
    }

    // Update metrics
    this.state.metrics.decisionsToday++

    return decision
  }

  protected createAction(
    decision: AgentDecision,
    type: string,
    description: string,
    payload: Record<string, any>,
    requiresApproval: boolean = false
  ): AgentAction {
    const action: AgentAction = {
      id: nanoid(),
      agentId: this.config.id,
      decisionId: decision.id,
      type,
      description,
      payload,
      autonomyLevel: this.config.autonomyLevel,
      status: 'pending',
      requiresApproval,
    }

    // Update metrics
    this.state.metrics.actionsToday++

    return action
  }

  protected log(message: string, data?: any): void {
    console.log(`[${this.config.name}] ${message}`, data || '')
  }

  protected logError(message: string, error?: any): void {
    console.error(`[${this.config.name}] ❌ ${message}`, error || '')
  }
}
