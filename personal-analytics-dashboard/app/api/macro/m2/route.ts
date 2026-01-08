import { NextResponse } from 'next/server'

const FRED_API_URL = 'https://api.stlouisfed.org/fred/series/observations'
const SERIES_ID = 'M2SL' // M2 Money Stock, Seasonally Adjusted

export async function GET() {
  try {
    const apiKey = process.env.FRED_API_KEY

    if (!apiKey) {
      // Return mock data if no API key is configured
      return NextResponse.json(generateMockM2Data())
    }

    // Fetch last 5 years of data to show the cycle
    const response = await fetch(
      `${FRED_API_URL}?series_id=${SERIES_ID}&api_key=${apiKey}&file_type=json&observation_start=2020-01-01`,
      { next: { revalidate: 86400 } } // Cache for 24 hours (M2 only updates monthly)
    )

    if (!response.ok) {
      console.warn('FRED API request failed, using mock data')
      return NextResponse.json(generateMockM2Data())
    }

    const data = await response.json()

    // Transform data for Recharts (simplify the payload)
    const chartData = data.observations.map((obs: any) => ({
      date: obs.date,
      value: parseFloat(obs.value), // Convert string "20800.5" to number
    }))

    return NextResponse.json(chartData)

  } catch (error) {
    console.error('Failed to fetch M2 data:', error)
    return NextResponse.json(generateMockM2Data())
  }
}

// Generate mock M2 data for development/demo purposes
function generateMockM2Data() {
  const startDate = new Date('2020-01-01')
  const endDate = new Date()
  const data = []

  let currentValue = 15400 // Starting M2 in billions

  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    // Simulate COVID spike, then gradual increase
    const monthsSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

    if (monthsSinceStart < 3) {
      currentValue += 500 // COVID stimulus spike
    } else if (monthsSinceStart < 24) {
      currentValue += 100 // Continued expansion
    } else {
      currentValue += 50 // QT period (slower growth)
    }

    data.push({
      date: d.toISOString().split('T')[0],
      value: currentValue + Math.random() * 100 - 50 // Add some noise
    })
  }

  return data
}
