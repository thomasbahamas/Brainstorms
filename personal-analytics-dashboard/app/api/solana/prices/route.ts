import { NextRequest, NextResponse } from "next/server"

// Jupiter Price API v2 — free, no key needed
const JUPITER_PRICE_URL = "https://api.jup.ag/price/v2"

// SOL native mint used by Jupiter
const SOL_MINT = "So11111111111111111111111111111111111111112"

export async function GET(request: NextRequest) {
  const mints = request.nextUrl.searchParams.get("mints")

  if (!mints) {
    return NextResponse.json({ error: "mints parameter required (comma-separated)" }, { status: 400 })
  }

  try {
    // Always include SOL
    const mintList = mints.split(",").filter(Boolean)
    if (!mintList.includes(SOL_MINT)) {
      mintList.unshift(SOL_MINT)
    }

    const ids = mintList.join(",")
    const res = await fetch(`${JUPITER_PRICE_URL}?ids=${ids}&showExtraInfo=true`, {
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      throw new Error(`Jupiter API returned ${res.status}`)
    }

    const json = await res.json()

    // Transform Jupiter response into our format
    const prices: Record<string, {
      price: number
      change24h: number | null
    }> = {}

    for (const [mint, data] of Object.entries(json.data || {})) {
      const d = data as any
      const price = parseFloat(d.price) || 0

      // Jupiter v2 extraInfo has last24h price change info
      let change24h: number | null = null
      if (d.extraInfo?.lastSwappedPrice?.lastJupiterSellAt) {
        // Approximate 24h change from confidence interval if available
        const confidence = d.extraInfo?.confidenceLevel
        if (d.extraInfo?.quotedPrice?.buyPrice && d.extraInfo?.quotedPrice?.sellPrice) {
          // Use depth-based estimation — not perfect but useful
        }
      }

      prices[mint] = { price, change24h }
    }

    return NextResponse.json({
      prices,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error("Jupiter price API error:", error)
    const message = error instanceof Error ? error.message : "Failed to fetch prices"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
