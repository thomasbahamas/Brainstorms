'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Play, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'

interface AgentState {
  config: {
    id: string
    name: string
    description: string
    domain: string
    enabled: boolean
    autonomyLevel: string
  }
  state: {
    status: string
    lastRun?: string
    errorCount: number
    successCount: number
    metrics: {
      decisionsToday: number
      actionsToday: number
      successRate: number
    }
  }
}

interface AgentAction {
  id: string
  agentId: string
  type: string
  description: string
  status: string
  requiresApproval: boolean
  payload: any
}

export function AgentMonitor() {
  const [agents, setAgents] = useState<AgentState[]>([])
  const [pendingActions, setPendingActions] = useState<AgentAction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const fetchPendingActions = async () => {
    try {
      const response = await fetch('/api/agents/actions')
      const data = await response.json()
      if (data.success) {
        setPendingActions(data.actions)
      }
    } catch (error) {
      console.error('Error fetching actions:', error)
    }
  }

  const triggerAgent = async (agentId: string) => {
    setRefreshing(true)
    try {
      await fetch('/api/agents/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      })
      await fetchAgents()
    } catch (error) {
      console.error('Error triggering agent:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const approveAction = async (actionId: string) => {
    try {
      await fetch('/api/agents/actions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, approvedBy: 'user' }),
      })
      await fetchPendingActions()
    } catch (error) {
      console.error('Error approving action:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchAgents()
      await fetchPendingActions()
      setLoading(false)
    }

    init()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAgents()
      fetchPendingActions()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'monitoring':
      case 'analyzing':
      case 'executing':
        return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-green-500/10 border-green-500/30 text-green-400'
      case 'monitoring':
      case 'analyzing':
      case 'executing':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Activity className="h-8 w-8 text-purple-500 animate-spin" />
            <span className="ml-2 text-gray-400">Initializing Agent System...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Autonomous Agents
            <span className="text-sm text-gray-400 font-normal ml-2">
              ({agents.filter((a) => a.config.enabled).length} active)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.config.id}
                className={`p-4 rounded-lg border ${getStatusColor(agent.state.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(agent.state.status)}
                    <div>
                      <h3 className="font-semibold text-white">{agent.config.name}</h3>
                      <p className="text-sm text-gray-400">{agent.config.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAgent(agent.config.id)}
                    disabled={refreshing}
                    className="px-3 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm transition-colors disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-semibold text-white capitalize">
                      {agent.state.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Decisions Today</p>
                    <p className="text-sm font-semibold text-white">
                      {agent.state.metrics.decisionsToday}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Actions Today</p>
                    <p className="text-sm font-semibold text-white">
                      {agent.state.metrics.actionsToday}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <p className="text-sm font-semibold text-green-400">
                      {agent.state.metrics.successRate.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {agent.state.lastRun && (
                  <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
                    Last run: {new Date(agent.state.lastRun).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Pending Approvals
              <span className="text-sm text-gray-400 font-normal ml-2">
                ({pendingActions.length} waiting)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{action.description}</h4>
                      <p className="text-sm text-gray-400">Type: {action.type}</p>
                    </div>
                    <button
                      onClick={() => approveAction(action.id)}
                      className="px-4 py-2 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                  <pre className="text-xs text-gray-500 mt-2 p-2 bg-black/30 rounded overflow-auto">
                    {JSON.stringify(action.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
