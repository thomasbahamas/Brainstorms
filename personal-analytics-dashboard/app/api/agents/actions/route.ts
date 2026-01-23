import { NextResponse } from 'next/server'
import { runtime } from '@/lib/agents/core/runtime'

// GET /api/agents/actions - Get pending actions
export async function GET() {
  try {
    const pendingActions = runtime.getPendingActions()

    return NextResponse.json({
      success: true,
      actions: pendingActions,
      count: pendingActions.length,
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

// POST /api/agents/actions/approve - Approve an action
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { actionId, approvedBy } = body

    if (!actionId || !approvedBy) {
      return NextResponse.json(
        { success: false, error: 'actionId and approvedBy are required' },
        { status: 400 }
      )
    }

    await runtime.approveAction(actionId, approvedBy)

    return NextResponse.json({
      success: true,
      message: `Action ${actionId} approved by ${approvedBy}`,
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

// DELETE /api/agents/actions/:id - Reject an action
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const actionId = searchParams.get('id')
    const reason = searchParams.get('reason') || 'Rejected by user'

    if (!actionId) {
      return NextResponse.json(
        { success: false, error: 'actionId is required' },
        { status: 400 }
      )
    }

    await runtime.rejectAction(actionId, reason)

    return NextResponse.json({
      success: true,
      message: `Action ${actionId} rejected`,
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
