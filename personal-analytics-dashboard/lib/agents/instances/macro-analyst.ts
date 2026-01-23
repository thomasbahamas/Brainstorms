import { BaseAgent } from '../core/base-agent'
import { AgentDecision, AgentAction } from '../core/types'

interface M2Data {
  date: string
  value: number
}

export class MacroAnalystAgent extends BaseAgent {
  private lastM2Value: number | null = null
  private threshold = 3 // 3% change triggers action

  constructor() {
    super({
      name: 'Macro Analyst',
      description: 'Monitors M2 liquidity and generates content when significant changes occur',
      domain: 'macro',
      capabilities: [
        'Monitor M2 money supply',
        'Detect liquidity trends',
        'Generate video scripts',
        'Book filming slots',
        'Create thumbnails',
      ],
      autonomyLevel: 'execute',
      enabled: true,
      monitoringInterval: '0 */6 * * *', // Every 6 hours
    })
  }

  async monitor(): Promise<AgentDecision | null> {
    this.log('Starting M2 monitoring cycle...')

    try {
      // Fetch M2 data from our API
      const m2Data = await this.fetchM2Data()

      if (!m2Data || m2Data.length === 0) {
        this.log('No M2 data available')
        return null
      }

      // Get latest and previous values
      const latest = m2Data[m2Data.length - 1]
      const previous = m2Data[m2Data.length - 13] || m2Data[0] // ~3 months ago (quarterly)

      const currentValue = latest.value
      const previousValue = previous.value

      // Calculate change
      const changePercent = ((currentValue - previousValue) / previousValue) * 100

      this.log(`M2 Change: ${changePercent.toFixed(2)}%`)

      // Check if change exceeds threshold
      if (Math.abs(changePercent) >= this.threshold) {
        const direction = changePercent > 0 ? 'expansion' : 'contraction'

        return this.createDecision(
          `M2 ${direction} detected`,
          `M2 money supply changed by ${changePercent.toFixed(2)}% over the past quarter. ` +
            `This ${direction} historically precedes crypto market movements in 3-6 months. ` +
            `High confidence: ${Math.min(95, 60 + Math.abs(changePercent) * 5)}%`,
          Math.min(95, 60 + Math.abs(changePercent) * 5),
          {
            currentM2: currentValue,
            previousM2: previousValue,
            changePercent,
            direction,
            date: latest.date,
          }
        )
      }

      // Store last value for next check
      this.lastM2Value = currentValue

      return null
    } catch (error) {
      this.logError('Error monitoring M2 data', error)
      return null
    }
  }

  async analyze(decision: AgentDecision): Promise<AgentAction | null> {
    this.log('Analyzing M2 decision...')

    const { changePercent, direction, currentM2 } = decision.dataPoints

    // Only generate content for significant changes
    if (decision.confidence < 70) {
      this.log('Confidence too low, skipping action')
      return null
    }

    // Create action to generate video content
    return this.createAction(
      decision,
      'generate_video_content',
      `Generate and schedule video about M2 ${direction}`,
      {
        videoTitle:
          direction === 'expansion'
            ? 'The Liquidity Wave is Here: Why SOL Will Explode'
            : 'Liquidity Drying Up: What This Means for Crypto',
        m2Change: changePercent,
        direction,
        urgency: decision.confidence > 85 ? 'high' : 'medium',
      },
      false // No approval needed - auto-execute
    )
  }

  async execute(action: AgentAction): Promise<any> {
    this.log(`Executing action: ${action.type}`)

    const { videoTitle, m2Change, direction, urgency } = action.payload

    try {
      // Step 1: Generate video script
      const scriptResult = await this.generateVideoScript(videoTitle, m2Change, direction)

      if (!scriptResult.success) {
        throw new Error(`Failed to generate script: ${scriptResult.error}`)
      }

      this.log('✅ Video script generated')

      // Step 2: Book filming slot
      const slotResult = await this.bookFilmingSlot(videoTitle, urgency as string)

      if (!slotResult.success) {
        throw new Error(`Failed to book slot: ${slotResult.error}`)
      }

      this.log('✅ Filming slot booked')

      // Step 3: Generate thumbnail concepts
      const thumbnailResult = await this.generateThumbnail(videoTitle)

      if (!thumbnailResult.success) {
        throw new Error(`Failed to generate thumbnail: ${thumbnailResult.error}`)
      }

      this.log('✅ Thumbnail generated')

      // Step 4: Save to Notion
      const notionResult = await this.tools.saveToNotion('Video Ideas', {
        title: videoTitle,
        status: 'Ready to Film',
        urgency,
        script: scriptResult.data,
        thumbnail: thumbnailResult.data,
        scheduledDate: slotResult.data,
      })

      if (!notionResult.success) {
        throw new Error(`Failed to save to Notion: ${notionResult.error}`)
      }

      this.log('✅ Saved to Notion')

      // Step 5: Send notification
      await this.tools.notify('slack', {
        subject: `🚨 ${urgency.toUpperCase()} URGENCY: New Video Ready`,
        body: `M2 liquidity ${direction} detected (${m2Change.toFixed(2)}%).\n\n` +
          `Video: "${videoTitle}"\n` +
          `Script ready, slot booked, thumbnail generated.\n` +
          `Check Notion for details.`,
      })

      this.log('✅ Notification sent')

      return {
        success: true,
        videoTitle,
        scriptGenerated: true,
        slotBooked: true,
        thumbnailCreated: true,
        notionPageId: notionResult.data,
      }
    } catch (error) {
      this.logError('Failed to execute action', error)
      throw error
    }
  }

  // === Helper Methods ===

  private async fetchM2Data(): Promise<M2Data[]> {
    try {
      const response = await fetch('http://localhost:3000/api/macro/m2')
      if (!response.ok) {
        throw new Error('Failed to fetch M2 data')
      }
      return await response.json()
    } catch (error) {
      this.logError('Error fetching M2 data', error)
      return []
    }
  }

  private async generateVideoScript(
    title: string,
    m2Change: number,
    direction: string
  ): Promise<any> {
    const prompt = `
You are a crypto content strategist for Solana Floor, a YouTube channel focused on Solana and macro trends.

Generate a compelling video script for: "${title}"

Context:
- M2 money supply just changed by ${m2Change.toFixed(2)}%
- This is a ${direction} in global liquidity
- Historically, M2 ${direction} precedes crypto repricing in 3-6 months

Structure:
1. Hook (first 10 seconds - must grab attention)
2. Thesis (what's happening with M2 and why it matters)
3. Data proof (show the M2 chart, correlation with SOL/BTC)
4. Implications (what this means for Solana specifically)
5. Call to action

Tone: Confident, data-driven, urgent but not alarmist. Use Raoul Pal's "Banana Zone" terminology.

Length: 8-10 minute video (~1500 words)
`

    return await this.tools.generateText(prompt)
  }

  private async bookFilmingSlot(title: string, urgency: string): Promise<any> {
    const today = new Date()
    const slots = await this.tools.getAvailability(today, 120) // 2 hour minimum

    if (!slots.success || !slots.data || slots.data.length === 0) {
      return { success: false, error: 'No available slots' }
    }

    // Book first available slot
    const slot = slots.data[0]

    return await this.tools.bookEvent({
      title: `🎥 FILM: ${title}`,
      start: slot.start,
      end: slot.end,
      description: `Urgency: ${urgency}\nAuto-scheduled by Macro Analyst Agent`,
    })
  }

  private async generateThumbnail(title: string): Promise<any> {
    return await this.tools.generateThumbnail({
      text: title,
      style: 'bold, yellow gradient, charts, professional',
    })
  }
}
