import { NextResponse } from 'next/server'
import { runtime } from '@/lib/agents/core/runtime'
import { MacroAnalystAgent } from '@/lib/agents/instances/macro-analyst'

// Initialize agents (singleton - only runs once)
let initialized = false

async function initializeAgents() {
  if (initialized) return

  console.log('🚀 Initializing Agent System...')

  // Register Macro Analyst
  const macroAnalyst = new MacroAnalystAgent()
  await runtime.registerAgent(macroAnalyst)

  // Start runtime
  await runtime.start()

  initialized = true
  console.log('✅ Agent System initialized')
}

// GET /api/agents - Get all agents and their states
export async function GET() {
  try {
    await initializeAgents()

    const agents = runtime.getAgents()

    const agentData = agents.map((agent) => ({
      config: agent.config,
      state: agent.getState(),
    }))

    return NextResponse.json({
      success: true,
      agents: agentData,
      totalAgents: agentData.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST /api/agents/trigger - Manually trigger an agent
export async function POST(request: Request) {
  try {
    await initializeAgents()

    const body = await request.json()
    const { agentId } = body

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'agentId is required' },
        { status: 400 }
      )
    }

    await runtime.triggerMonitoring(agentId)

    return NextResponse.json({
      success: true,
      message: `Monitoring triggered for agent ${agentId}`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
