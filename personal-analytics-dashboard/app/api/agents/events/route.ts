import { NextResponse } from 'next/server'
import { eventBus } from '@/lib/agents/core/event-bus'

// GET /api/agents/events - Get recent events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId') || undefined
    const type = searchParams.get('type') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')

    const events = eventBus.getEventLog({
      agentId,
      type: type as any,
      limit,
    })

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
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
