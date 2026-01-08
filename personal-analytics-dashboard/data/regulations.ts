export type JurisdictionStatus = 'SAFE' | 'CAUTION' | 'RESTRICTED'

export interface RegionData {
  id: string
  name: string
  status: JurisdictionStatus
  taxRate: string
  keyLaws: string[]
  alpha: string
  countdownDate?: string
  emoji: string
}

export const REGULATORY_DATA: RegionData[] = [
  // --- THE HOME BASE ---
  {
    id: 'US-CA',
    name: 'California',
    status: 'CAUTION',
    emoji: '🟡',
    taxRate: '~13.3% (State) + Fed',
    keyLaws: ['DFAL (BitLicense 2.0)', '$1k/day ATM Limit', 'Re-KYC Requirements'],
    alpha: 'DFAL enforcement starts July 2026. Expect exchanges to request re-KYC or delist tokens. High friction for DeFi off-ramps.',
    countdownDate: '2026-07-01'
  },

  // --- THE ESCAPE HATCHES ---
  {
    id: 'US-WY',
    name: 'Wyoming',
    status: 'SAFE',
    emoji: '🟢',
    taxRate: '0% State',
    keyLaws: ['DAO LLC Act', 'SPDI Bank Charters', 'Exempt Token Classifications'],
    alpha: 'Best for incorporating your personal holding company. DAOs are legal entities here. Clear regulatory framework.',
  },
  {
    id: 'US-FL',
    name: 'Florida',
    status: 'SAFE',
    emoji: '🟢',
    taxRate: '0% State',
    keyLaws: ['Pilot Program: Crypto for Fees', 'Pro-Innovation Stance'],
    alpha: 'Social hub for crypto. No specific crypto-hostile laws currently. Governor actively courting Web3 companies.',
  },
  {
    id: 'US-TX',
    name: 'Texas',
    status: 'SAFE',
    emoji: '🟢',
    taxRate: '0% State',
    keyLaws: ['State Bank Crypto Custody', 'Bitcoin Mining Incentives'],
    alpha: 'State-chartered banks authorized to custody crypto. Major mining hub. Pro-business environment.',
  },

  // --- GLOBAL HUBS ---
  {
    id: 'AE-DXB',
    name: 'Dubai (UAE)',
    status: 'SAFE',
    emoji: '🟢',
    taxRate: '0% Income',
    keyLaws: ['VARA Rulebook 2025', 'Virtual Asset License Framework'],
    alpha: 'The clearest regulatory framework globally. If you move, this is the #1 destination for crypto founders. Full clarity.',
  },
  {
    id: 'SG',
    name: 'Singapore',
    status: 'RESTRICTED',
    emoji: '🔴',
    taxRate: '0% Cap Gains (Tiered Income)',
    keyLaws: ['MAS Payment Services Act (Tightened)', 'Retail Restrictions 2024'],
    alpha: 'No longer a startup haven. High barrier to entry. Only for established institutions now. Tightening retail access.',
  },
  {
    id: 'PT',
    name: 'Portugal',
    status: 'CAUTION',
    emoji: '🟡',
    taxRate: '28% on Crypto Gains (2023+)',
    keyLaws: ['EU MiCA Compliance Required', 'Crypto Tax Introduction'],
    alpha: 'Lost "crypto tax haven" status in 2023. Now aligned with EU regulations. Still decent quality of life.',
  },
  {
    id: 'CH',
    name: 'Switzerland (Zug)',
    status: 'SAFE',
    emoji: '🟢',
    taxRate: 'Wealth Tax (Varies)',
    keyLaws: ['Crypto Valley Association', 'Clear DLT Legal Framework'],
    alpha: 'Crypto Valley - established legal framework since 2016. Institutional-grade infrastructure. High cost of living.',
  }
]

// Helper function to get countdown to DFAL
export function getDaysUntilDFAL(): number {
  const targetDate = new Date('2026-07-01')
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
