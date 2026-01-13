'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { REGULATORY_DATA, getDaysUntilDFAL, type JurisdictionStatus } from '@/data/regulations'
import { Shield, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react'

export function RegulatoryCommandCenter() {
  const daysUntilDFAL = getDaysUntilDFAL()

  const getStatusIcon = (status: JurisdictionStatus) => {
    switch (status) {
      case 'SAFE':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'CAUTION':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'RESTRICTED':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: JurisdictionStatus) => {
    switch (status) {
      case 'SAFE':
        return 'bg-green-500/10 border-green-500/30 text-green-400'
      case 'CAUTION':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      case 'RESTRICTED':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Regulatory Command Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* California DFAL Countdown */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-white text-lg">California DFAL Enforcement</h3>
                  <p className="text-sm text-gray-400">Digital Financial Assets Law</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-400">{daysUntilDFAL}</p>
                <p className="text-xs text-gray-400">days remaining</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-yellow-400">Action Required:</span> Exchanges may
              require re-KYC or restrict certain tokens. Consider establishing presence in friendly jurisdictions.
            </p>
          </div>

          {/* Jurisdiction Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Jurisdiction Analysis
            </h3>

            {REGULATORY_DATA.map((region) => (
              <div
                key={region.id}
                className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${getStatusColor(region.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{region.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(region.status)}
                        <h4 className="font-semibold text-white">{region.name}</h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Tax Rate: {region.taxRate}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(region.status)}`}>
                    {region.status}
                  </span>
                </div>

                {/* Key Laws */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Key Regulations:</p>
                  <div className="flex flex-wrap gap-1">
                    {region.keyLaws.map((law) => (
                      <span
                        key={law}
                        className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300"
                      >
                        {law}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Alpha */}
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Strategic Insight:</p>
                  <p className="text-sm text-gray-300">{region.alpha}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Recommendations */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Strategic Moves</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Short-term:</span> Monitor California DFAL compliance
                  requirements. Prepare alternative off-ramp strategies.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Mid-term:</span> Consider Wyoming LLC for holding company.
                  UAE residency for long-term optionality.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Content Angle:</span> "Where Can You Actually LIVE as a
                  Crypto Founder in 2026?" (High engagement topic)
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
