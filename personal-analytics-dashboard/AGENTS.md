# Agentic Layer Documentation

**v3.0 - The Value Shift: From Apps to Agents**

## Overview

The Agentic Layer transforms the dashboard from a passive display into an autonomous system that **monitors, decides, and acts** on your behalf. As Satya Nadella stated: *"In an agentic world, apps become passive databases while AI agents hold the intelligence, make decisions & do the work."*

This is that future, built today.

---

## Architecture

```
Data Streams → AI Agents → Autonomous Actions → Dashboard Monitors Results
```

### Core Components

**1. Agent Runtime** (`lib/agents/core/runtime.ts`)
- Event-driven execution engine
- Cron-based scheduling
- Action queue with approval workflow
- Real-time state management

**2. Event Bus** (`lib/agents/core/event-bus.ts`)
- Pub/sub event system
- Event logging and replay
- Agent inter-communication

**3. Tool Integration** (`lib/agents/tools/index.ts`)
- LLM APIs (OpenAI GPT-4)
- Calendar booking (Google Calendar)
- Notifications (Slack, Email, Telegram)
- Blockchain (Solana, Jupiter)
- Content generation (DALL-E, YouTube)
- Database (Notion)

**4. Base Agent** (`lib/agents/core/base-agent.ts`)
- Abstract class all agents extend
- Lifecycle management
- Decision/action creation helpers

---

## Autonomy Levels

Each agent operates at one of three autonomy levels:

### 1. **Notify** (Lowest Risk)
- Agent makes decisions
- Sends notifications to you
- You take manual action
- **Example**: Trading signals (high-value transactions)

### 2. **Suggest** (Medium Risk)
- Agent creates action plans
- Presents for approval via UI
- You approve/reject
- **Example**: Booking meetings, posting content

### 3. **Execute** (Highest Value)
- Agent decides AND acts
- No approval needed
- Fully autonomous
- **Example**: Generating scripts, completing airdrop tasks

---

## Current Agents

### 1. Macro Analyst Agent

**Domain**: Macro Intelligence
**Autonomy**: Execute
**Schedule**: Every 6 hours

**What it monitors:**
- Federal Reserve M2 Money Supply (FRED API)
- Quarter-over-quarter liquidity changes
- Threshold: ±3% change

**What it does autonomously:**

When M2 changes ≥3%:
1. **Generates video script** using GPT-4
   - Title based on direction (expansion/contraction)
   - Full 8-10 minute script with hooks, data proof, implications
   - Optimized for Solana Floor audience

2. **Books filming slot** on your calendar
   - Finds next 2-hour availability
   - Auto-schedules with high priority
   - Adds urgency level to event

3. **Creates thumbnail concepts** via DALL-E
   - Bold, yellow gradient style
   - Professional chart overlays
   - Attention-grabbing text

4. **Drafts YouTube description**
   - SEO-optimized
   - Timestamp placeholders
   - Call-to-action included

5. **Saves to Notion** "Video Ideas" database
   - Status: "Ready to Film"
   - All assets attached
   - Urgency tagged

6. **Sends Slack notification**
   - Summary of M2 change
   - Link to Notion page
   - 48-hour filming window

**Example Output:**
```
🚨 HIGH URGENCY: M2 Liquidity Expanded 4.2%

Video: "The Liquidity Wave is Here: Why SOL Will Explode"
Script: ✅ Generated (1,847 words)
Slot: ✅ Booked (Tomorrow 2-4pm)
Thumbnail: ✅ Created
Notion: ✅ Ready to Film

Film within 48 hours for maximum relevance.
```

---

## Future Agents (Roadmap)

### 2. Content Strategist Agent
**Domain**: Content
**Autonomy**: Execute
**Schedule**: Hourly

**Monitors:**
- Stablecoin supply ATHs
- Twitter volume spikes
- Competitor uploads
- Narrative velocity

**Autonomous Actions:**
- Research competitor gaps
- Generate differentiated scripts
- Auto-publish to Notion
- Send urgency alerts

### 3. Portfolio Manager Agent
**Domain**: Portfolio
**Autonomy**: Notify (trades), Execute (airdrops)
**Schedule**: Every 15 minutes

**Monitors:**
- High-confidence trading signals (>85%)
- Airdrop deadlines (<7 days)
- On-chain opportunities (yield >15%)

**Autonomous Actions:**
- **Airdrops**: Complete tasks (swaps, stakes, LP)
- **Trades**: Backtest, calculate position size, send approval request

### 4. Regulatory Navigator
**Domain**: Regulatory
**Autonomy**: Execute
**Schedule**: Daily

**Monitors:**
- DFAL countdown (<180 days)
- New SEC rulings
- Exchange geo-restrictions

**Autonomous Actions:**
- Research Wyoming LLC requirements
- Generate operating agreements
- Find registered agents
- Create filing checklists

### 5. Health Optimizer
**Domain**: Health
**Autonomy**: Execute
**Schedule**: Every 2 hours

**Monitors:**
- Workout streak breaks
- Sleep patterns
- High-stress periods (multiple deadlines)

**Autonomous Actions:**
- Auto-book workout slots
- Generate workout plans
- Order meal prep service
- Block recovery time

---

## Agent Lifecycle

```typescript
// 1. Registration
const agent = new MacroAnalystAgent()
await runtime.registerAgent(agent)

// 2. Initialization
await agent.initialize()

// 3. Scheduled Monitoring
// Runs on cron: "0 */6 * * *"
const decision = await agent.monitor()

// 4. Analysis
if (decision) {
  const action = await agent.analyze(decision)
}

// 5. Execution (if approved/autonomous)
if (action.autonomyLevel === 'execute') {
  const result = await agent.execute(action)
}

// 6. Event Emission
eventBus.emitAgentEvent({
  type: 'completion',
  agentId: agent.config.id,
  data: { result }
})
```

---

## Approval Workflow

For actions requiring approval:

```
1. Agent creates action
2. Action added to queue (status: 'pending')
3. UI shows pending action card
4. User clicks "Approve" or "Reject"
5. If approved: action executes
6. If rejected: removed from queue
```

**Dashboard UI:**
- Real-time pending actions
- One-click approve/reject
- Full action payload visibility
- Risk level indicators

---

## Event System

All agent activity emits events:

```typescript
// Event Types
type EventType =
  | 'monitoring'  // Agent started monitoring
  | 'decision'    // Decision made
  | 'action'      // Action created
  | 'approval'    // Action approved/rejected
  | 'completion'  // Action completed
  | 'error'       // Error occurred

// Subscribe to events
eventBus.subscribe('decision', (event) => {
  console.log(`Agent ${event.agentId} made a decision:`, event.data)
})

// Get event log
const events = eventBus.getEventLog({
  agentId: 'macro-analyst',
  type: 'completion',
  limit: 10
})
```

---

## API Endpoints

### GET /api/agents
Get all agents and their current states

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "config": {
        "id": "macro-analyst",
        "name": "Macro Analyst",
        "enabled": true,
        "autonomyLevel": "execute"
      },
      "state": {
        "status": "idle",
        "lastRun": "2026-01-08T14:30:00Z",
        "metrics": {
          "decisionsToday": 2,
          "actionsToday": 1,
          "successRate": 100
        }
      }
    }
  ]
}
```

### POST /api/agents/trigger
Manually trigger an agent

**Request:**
```json
{
  "agentId": "macro-analyst"
}
```

### GET /api/agents/actions
Get pending actions awaiting approval

### POST /api/agents/actions/approve
Approve a pending action

**Request:**
```json
{
  "actionId": "act_12345",
  "approvedBy": "user"
}
```

### GET /api/agents/events
Get event log with filters

**Query Params:**
- `agentId` - Filter by agent
- `type` - Filter by event type
- `limit` - Max events to return

---

## Environment Setup

```env
# Required for LLM features
OPENAI_API_KEY=sk-...

# Optional integrations
GOOGLE_CALENDAR_API_KEY=...
SLACK_WEBHOOK_URL=...
NOTION_API_KEY=...
```

---

## Usage Examples

### Start the Agent System

The system starts automatically when you access the dashboard at `http://localhost:3000`. Agents begin monitoring based on their cron schedules.

### Manual Trigger

Click the "Play" button next to any agent in the dashboard, or use the API:

```bash
curl -X POST http://localhost:3000/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{"agentId":"macro-analyst"}'
```

### Monitor Agent Activity

Watch the dashboard's "Autonomous Agents" section for:
- Agent status (idle/monitoring/executing)
- Today's decisions and actions
- Success rates
- Pending approvals

---

## Creating a Custom Agent

```typescript
import { BaseAgent } from '@/lib/agents/core/base-agent'
import { AgentDecision, AgentAction } from '@/lib/agents/core/types'

export class MyCustomAgent extends BaseAgent {
  constructor() {
    super({
      name: 'My Custom Agent',
      description: 'Does something awesome',
      domain: 'custom',
      capabilities: ['monitor data', 'take action'],
      autonomyLevel: 'execute',
      enabled: true,
      monitoringInterval: '0 * * * *', // Hourly
    })
  }

  async monitor(): Promise<AgentDecision | null> {
    // Check for conditions
    const shouldAct = await this.checkConditions()

    if (shouldAct) {
      return this.createDecision(
        'Condition met',
        'Reasoning here',
        85, // confidence
        { data: 'points' }
      )
    }

    return null
  }

  async analyze(decision: AgentDecision): Promise<AgentAction | null> {
    // Decide what action to take
    return this.createAction(
      decision,
      'my_action_type',
      'Description of action',
      { payload: 'data' },
      false // requiresApproval
    )
  }

  async execute(action: AgentAction): Promise<any> {
    // Perform the action
    const result = await this.tools.notify('slack', {
      body: 'Action completed!'
    })

    return result
  }
}
```

Then register it:

```typescript
// In app/api/agents/route.ts
const myAgent = new MyCustomAgent()
await runtime.registerAgent(myAgent)
```

---

## The Value Proposition

**Before (v2.0 - Passive Dashboard):**
- You wake up
- Check dashboard
- See M2 increased 4.2%
- Think "I should make a video about this"
- Spend 3 hours writing script
- Book filming slot
- Create thumbnail
- **Total time: 4 hours**

**After (v3.0 - Agentic):**
- Agent detects M2 change while you sleep
- Generates professional script
- Books your calendar
- Creates thumbnail
- Notifies you: "Video ready to film"
- You wake up to completed work
- **Total time: 5 minutes (review and approve)**

**The shift:** Apps are commodities. Agents are the business. You pay for work done, not pixels displayed.

---

## Security & Safety

- All blockchain transactions require approval (autonomy: notify)
- High-value actions include risk assessment
- Event log maintains full audit trail
- Agents can be disabled individually
- Action queue allows pre-execution review

---

## Performance

- Agents run in background (no blocking)
- Event-driven architecture (efficient)
- Cron scheduling (no polling waste)
- Mock tools for development (fast iteration)
- Production tools swap in seamlessly

---

This is the future Satya described. Your dashboard is the database. Your agents are your team.
