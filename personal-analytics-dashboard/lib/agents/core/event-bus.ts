import { AgentEvent } from './types'
import { EventEmitter } from 'events'

type EventHandler = (event: AgentEvent) => void | Promise<void>

export class AgentEventBus extends EventEmitter {
  private static instance: AgentEventBus
  private eventLog: AgentEvent[] = []
  private maxLogSize = 1000

  private constructor() {
    super()
    this.setMaxListeners(50) // Allow many agents to subscribe
  }

  static getInstance(): AgentEventBus {
    if (!AgentEventBus.instance) {
      AgentEventBus.instance = new AgentEventBus()
    }
    return AgentEventBus.instance
  }

  // Emit typed event
  emitAgentEvent(event: AgentEvent): void {
    // Log event
    this.logEvent(event)

    // Emit to listeners
    this.emit(event.type, event)
    this.emit('*', event) // Global listener
  }

  // Subscribe to event type
  subscribe(type: AgentEvent['type'] | '*', handler: EventHandler): () => void {
    this.on(type, handler)

    // Return unsubscribe function
    return () => {
      this.off(type, handler)
    }
  }

  // Get event log
  getEventLog(filter?: {
    agentId?: string
    type?: AgentEvent['type']
    since?: Date
    limit?: number
  }): AgentEvent[] {
    let events = [...this.eventLog]

    if (filter) {
      if (filter.agentId) {
        events = events.filter((e) => e.agentId === filter.agentId)
      }
      if (filter.type) {
        events = events.filter((e) => e.type === filter.type)
      }
      if (filter.since) {
        events = events.filter((e) => e.timestamp >= filter.since)
      }
      if (filter.limit) {
        events = events.slice(-filter.limit)
      }
    }

    return events
  }

  // Clear old events
  clearOldEvents(olderThan: Date): void {
    this.eventLog = this.eventLog.filter((e) => e.timestamp >= olderThan)
  }

  private logEvent(event: AgentEvent): void {
    this.eventLog.push(event)

    // Trim log if too large
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize)
    }

    // Console log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Agent Event] ${event.type} | ${event.agentId}`, event.data)
    }
  }
}

// Singleton instance
export const eventBus = AgentEventBus.getInstance()
