import cron from 'node-cron'
import { nanoid } from 'nanoid'
import { eventBus } from './event-bus'
import {
  IAgent,
  AgentConfig,
  AgentState,
  AgentEvent,
  AgentAction,
  AgentDecision,
  ActionStatus,
} from './types'

export class AgentRuntime {
  private static instance: AgentRuntime
  private agents: Map<string, IAgent> = new Map()
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map()
  private actionQueue: AgentAction[] = []
  private isRunning = false

  private constructor() {
    // Initialize event listeners
    this.setupEventListeners()
  }

  static getInstance(): AgentRuntime {
    if (!AgentRuntime.instance) {
      AgentRuntime.instance = new AgentRuntime()
    }
    return AgentRuntime.instance
  }

  // Register an agent
  async registerAgent(agent: IAgent): Promise<void> {
    const { id, name, enabled, monitoringInterval } = agent.config

    if (this.agents.has(id)) {
      throw new Error(`Agent ${id} is already registered`)
    }

    // Initialize agent
    await agent.initialize()

    // Store agent
    this.agents.set(id, agent)

    // Schedule monitoring if enabled
    if (enabled && monitoringInterval) {
      this.scheduleMonitoring(agent)
    }

    // Emit registration event
    this.emitEvent(id, 'monitoring', {
      message: `Agent ${name} registered and ${enabled ? 'enabled' : 'disabled'}`,
    })

    console.log(`✅ Agent registered: ${name} (${id})`)
  }

  // Unregister an agent
  async unregisterAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId)
    if (!agent) return

    // Stop scheduled task
    const task = this.scheduledTasks.get(agentId)
    if (task) {
      task.stop()
      this.scheduledTasks.delete(agentId)
    }

    // Shutdown agent
    await agent.shutdown()

    // Remove from registry
    this.agents.delete(agentId)

    console.log(`🛑 Agent unregistered: ${agent.config.name}`)
  }

  // Start the runtime
  async start(): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    console.log('🚀 Agent Runtime started')

    // Start processing action queue
    this.processActionQueue()
  }

  // Stop the runtime
  async stop(): Promise<void> {
    if (!this.isRunning) return

    this.isRunning = false

    // Stop all scheduled tasks
    for (const [agentId, task] of this.scheduledTasks.entries()) {
      task.stop()
    }

    // Shutdown all agents
    for (const [agentId, agent] of this.agents.entries()) {
      await agent.shutdown()
    }

    console.log('🛑 Agent Runtime stopped')
  }

  // Get all agents
  getAgents(): IAgent[] {
    return Array.from(this.agents.values())
  }

  // Get agent by ID
  getAgent(agentId: string): IAgent | undefined {
    return this.agents.get(agentId)
  }

  // Get agent state
  getAgentState(agentId: string): AgentState | undefined {
    return this.agents.get(agentId)?.getState()
  }

  // Manual trigger for agent monitoring
  async triggerMonitoring(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    await this.runMonitoringCycle(agent)
  }

  // Approve an action
  async approveAction(actionId: string, approvedBy: string): Promise<void> {
    const action = this.actionQueue.find((a) => a.id === actionId)
    if (!action) {
      throw new Error(`Action ${actionId} not found in queue`)
    }

    action.status = 'approved'
    action.approvedBy = approvedBy
    action.approvedAt = new Date()

    // Emit approval event
    const agent = this.agents.get(action.agentId)
    if (agent) {
      this.emitEvent(action.agentId, 'approval', {
        actionId,
        approvedBy,
        action: action.type,
      })
    }

    console.log(`✅ Action approved: ${action.type} by ${approvedBy}`)
  }

  // Reject an action
  async rejectAction(actionId: string, reason: string): Promise<void> {
    const action = this.actionQueue.find((a) => a.id === actionId)
    if (!action) {
      throw new Error(`Action ${actionId} not found in queue`)
    }

    action.status = 'rejected'
    action.error = reason

    // Remove from queue
    this.actionQueue = this.actionQueue.filter((a) => a.id !== actionId)

    console.log(`❌ Action rejected: ${action.type} - ${reason}`)
  }

  // Get pending actions (for approval UI)
  getPendingActions(): AgentAction[] {
    return this.actionQueue.filter((a) => a.status === 'pending')
  }

  // Private: Schedule monitoring for an agent
  private scheduleMonitoring(agent: IAgent): void {
    const { id, name, monitoringInterval } = agent.config

    if (!cron.validate(monitoringInterval)) {
      console.error(`Invalid cron expression for ${name}: ${monitoringInterval}`)
      return
    }

    const task = cron.schedule(monitoringInterval, async () => {
      await this.runMonitoringCycle(agent)
    })

    this.scheduledTasks.set(id, task)
    console.log(`📅 Scheduled ${name}: ${monitoringInterval}`)
  }

  // Private: Run one monitoring cycle
  private async runMonitoringCycle(agent: IAgent): Promise<void> {
    const { id, name } = agent.config

    try {
      // Update state
      agent.updateState({ status: 'monitoring', lastRun: new Date() })

      // Run monitoring
      const decision = await agent.monitor()

      if (decision) {
        // Agent made a decision
        agent.updateState({
          status: 'analyzing',
          lastDecision: decision,
        })

        this.emitEvent(id, 'decision', {
          decision: decision.trigger,
          confidence: decision.confidence,
        })

        // Analyze and potentially create action
        const action = await agent.analyze(decision)

        if (action) {
          // Add to action queue
          this.actionQueue.push(action)

          // If auto-execute, queue it
          if (action.autonomyLevel === 'execute' && !action.requiresApproval) {
            // Auto-approve and execute
            action.status = 'approved'
            action.approvedBy = 'system'
            action.approvedAt = new Date()
          }

          this.emitEvent(id, 'action', {
            actionType: action.type,
            requiresApproval: action.requiresApproval,
          })
        }
      }

      // Back to idle
      agent.updateState({ status: 'idle' })
    } catch (error) {
      agent.updateState({ status: 'error', errorCount: agent.state.errorCount + 1 })

      this.emitEvent(id, 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      console.error(`❌ Error in ${name}:`, error)
    }
  }

  // Private: Process action queue
  private async processActionQueue(): Promise<void> {
    setInterval(async () => {
      if (!this.isRunning) return

      // Find approved actions
      const approvedActions = this.actionQueue.filter((a) => a.status === 'approved')

      for (const action of approvedActions) {
        const agent = this.agents.get(action.agentId)
        if (!agent) continue

        try {
          // Execute action
          agent.updateState({ status: 'executing', lastAction: action })

          const result = await agent.execute(action)

          // Mark as completed
          action.status = 'completed'
          action.executedAt = new Date()
          action.result = result

          // Update metrics
          const state = agent.getState()
          agent.updateState({
            status: 'idle',
            successCount: state.successCount + 1,
          })

          this.emitEvent(action.agentId, 'completion', {
            actionId: action.id,
            actionType: action.type,
            result,
          })

          // Remove from queue
          this.actionQueue = this.actionQueue.filter((a) => a.id !== action.id)

          console.log(`✅ Action completed: ${action.type}`)
        } catch (error) {
          action.status = 'failed'
          action.error = error instanceof Error ? error.message : 'Unknown error'

          this.emitEvent(action.agentId, 'error', {
            actionId: action.id,
            error: action.error,
          })

          console.error(`❌ Action failed: ${action.type}`, error)
        }
      }
    }, 5000) // Check every 5 seconds
  }

  // Private: Setup event listeners
  private setupEventListeners(): void {
    eventBus.subscribe('*', (event) => {
      // Could add analytics, logging, webhooks here
    })
  }

  // Private: Emit event
  private emitEvent(
    agentId: string,
    type: AgentEvent['type'],
    data: Record<string, any>
  ): void {
    const event: AgentEvent = {
      id: nanoid(),
      agentId,
      type,
      timestamp: new Date(),
      data,
    }

    eventBus.emitAgentEvent(event)
  }
}

// Singleton instance
export const runtime = AgentRuntime.getInstance()
