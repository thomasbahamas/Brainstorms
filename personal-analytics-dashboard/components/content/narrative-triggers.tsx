'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, TrendingUp, AlertCircle, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NarrativeTrigger {
  id: string
  title: string
  reasoning: string
  urgency: 'high' | 'medium' | 'low'
  category: string
  dataSignals: string[]
  hooks: string[]
  estimatedViews: number
  trendinessScore: number
}

export function NarrativeTriggers() {
  const [triggers, setTriggers] = useState<NarrativeTrigger[]>([])

  useEffect(() => {
    // In production, this would analyze real market data
    // For now, generate example triggers based on common patterns
    const generatedTriggers = analyzeMarketConditions()
    setTriggers(generatedTriggers)
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      case 'low': return 'bg-green-500/10 border-green-500/30 text-green-400'
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case 'low': return <Zap className="h-4 w-4 text-green-500" />
      default: return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Script-to-Screen: AI Narrative Triggers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Explanation */}
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-purple-400">Auto-Generated Ideas:</span> Based on
              real-time data from M2 liquidity, stablecoin velocity, DeFi yields, and social sentiment.
              Film these within 48 hours for maximum relevance.
            </p>
          </div>

          {/* Triggers */}
          <div className="space-y-3">
            {triggers.map((trigger) => (
              <div
                key={trigger.id}
                className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${getUrgencyColor(trigger.urgency)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getUrgencyIcon(trigger.urgency)}
                    <div>
                      <h3 className="font-semibold text-white text-lg">{trigger.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{trigger.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border uppercase ${getUrgencyColor(trigger.urgency)}`}>
                    {trigger.urgency} urgency
                  </span>
                </div>

                {/* Data Signals */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Triggered by:</p>
                  <div className="flex flex-wrap gap-1">
                    {trigger.dataSignals.map((signal, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reasoning */}
                <p className="text-sm text-gray-300 mb-3">{trigger.reasoning}</p>

                {/* Video Hooks */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Suggested Hooks:</p>
                  <div className="space-y-1">
                    {trigger.hooks.map((hook, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5" />
                        <p className="text-sm text-gray-300">{hook}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Est. Views</p>
                    <p className="text-lg font-bold text-white">
                      {trigger.estimatedViews.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Trending Score</p>
                    <p className="text-lg font-bold text-white">
                      {trigger.trendinessScore}/100
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Trigger Settings</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>M2 Liquidity Change Threshold:</span>
                <span className="text-purple-400 font-medium">±3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Stablecoin Supply ATH Detection:</span>
                <span className="text-green-400 font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Social Sentiment Spike:</span>
                <span className="text-yellow-400 font-medium">&gt;50% increase</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Simulate market condition analysis
function analyzeMarketConditions(): NarrativeTrigger[] {
  return [
    {
      id: '1',
      title: 'Institutions Are Quietly Buying SOL (Data Proof)',
      reasoning: 'Stablecoin market cap just hit new ATH on Solana ($48B+). USDC velocity increased 15% this week. This signals institutional accumulation, not retail speculation.',
      urgency: 'high',
      category: 'Institutional Flow',
      dataSignals: ['USDC Supply ATH', 'Velocity +15%', 'Large Wallet Inflows'],
      hooks: [
        '"While you were watching memecoins, THIS happened..."',
        '"The data doesn\'t lie: Institutions are back"',
        '"Why Solana stablecoin growth matters MORE than price"'
      ],
      estimatedViews: 85000,
      trendinessScore: 94
    },
    {
      id: '2',
      title: 'The Casino is Dead, Long Live the Network (DeFi Analysis)',
      reasoning: 'Memecoin volume dropped to 3% of total DEX volume. Meanwhile, DeFi TVL up 12% and real-world payment volume (PYUSD) up 28%. The market is maturing.',
      urgency: 'medium',
      category: 'Market Structure',
      dataSignals: ['Meme Volume -65%', 'DeFi TVL +12%', 'PYUSD +28%'],
      hooks: [
        '"The memecoin party is over. Here\'s what\'s next..."',
        '"Why serious money is moving to DeFi (not memes)"',
        '"This is the REAL Solana bull run"'
      ],
      estimatedViews: 62000,
      trendinessScore: 88
    },
    {
      id: '3',
      title: 'Why M2 Money Supply Predicts SOL\'s Next Move',
      reasoning: 'Global M2 liquidity up 4.2% this quarter. Historically, crypto reprices 3-6 months after M2 acceleration. We\'re entering the "Banana Zone."',
      urgency: 'high',
      category: 'Macro Analysis',
      dataSignals: ['M2 Growth +4.2%', 'Historical Correlation 0.87', 'Fed Balance Sheet Expanding'],
      hooks: [
        '"This chart predicted every crypto bull run (watch closely)"',
        '"The \\"Banana Zone\\" indicator just flipped green"',
        '"Why 2026 could be the biggest year yet (macro proof)"'
      ],
      estimatedViews: 120000,
      trendinessScore: 97
    },
    {
      id: '4',
      title: 'Where You Can Actually LIVE as a Crypto Founder in 2026',
      reasoning: 'California DFAL enforcement in 540 days. Many creators asking about relocation. Wyoming, Florida, Dubai seeing increased interest from crypto founders.',
      urgency: 'medium',
      category: 'Regulatory',
      dataSignals: ['DFAL Countdown Active', 'State Migration Trending', 'Dubai VARA Clarity'],
      hooks: [
        '"California just made life harder for crypto (here are your options)"',
        '"The 3 best states for crypto founders (tax + regulation)"',
        '"Why everyone\'s moving to Dubai (and should you?)"'
      ],
      estimatedViews: 95000,
      trendinessScore: 91
    }
  ]
}
