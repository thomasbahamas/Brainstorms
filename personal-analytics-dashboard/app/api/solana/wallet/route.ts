import { NextRequest, NextResponse } from "next/server"

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"

// Known SPL token mints -> metadata
const TOKEN_META: Record<string, { symbol: string; name: string; decimals: number }> = {
  So11111111111111111111111111111111111111112: { symbol: "SOL", name: "Solana", decimals: 9 },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: { symbol: "USDC", name: "USD Coin", decimals: 6 },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: { symbol: "USDT", name: "Tether USD", decimals: 6 },
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: { symbol: "JUP", name: "Jupiter", decimals: 6 },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: { symbol: "BONK", name: "Bonk", decimals: 5 },
  jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL: { symbol: "JTO", name: "Jito", decimals: 9 },
  HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3: { symbol: "PYTH", name: "Pyth Network", decimals: 6 },
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: { symbol: "mSOL", name: "Marinade SOL", decimals: 9 },
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: { symbol: "jitoSOL", name: "Jito SOL", decimals: 9 },
  orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE: { symbol: "ORCA", name: "Orca", decimals: 6 },
  RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a: { symbol: "RLB", name: "Rollbit", decimals: 2 },
  WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p91oTh: { symbol: "WEN", name: "Wen", decimals: 5 },
  "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ": { symbol: "W", name: "Wormhole", decimals: 6 },
  EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: { symbol: "WIF", name: "dogwifhat", decimals: 6 },
  DRiFTZsBhV2RJh5y5SUoxu42FGBqDWkuNMrZTSGYe7sY: { symbol: "DRIFT", name: "Drift", decimals: 6 },
  TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6: { symbol: "TNSR", name: "Tensor", decimals: 8 },
  KMNo3nJsBXfcFuiKDqSBvDdBqGHTJveFQTMssNkGpFE: { symbol: "KMNO", name: "Kamino", decimals: 6 },
}

// SPL Token Program ID
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "address parameter required" }, { status: 400 })
  }

  try {
    // Fetch SOL balance and token accounts in parallel
    const [balanceResult, tokenAccountsResult] = await Promise.all([
      rpcCall("getBalance", [address]),
      rpcCall("getTokenAccountsByOwner", [
        address,
        { programId: TOKEN_PROGRAM_ID },
        { encoding: "jsonParsed" },
      ]),
    ])

    const solBalance = (balanceResult?.value ?? 0) / 1e9

    // Parse token accounts
    const tokens: Array<{
      mint: string
      symbol: string
      name: string
      balance: number
    }> = []

    if (tokenAccountsResult?.value) {
      for (const account of tokenAccountsResult.value) {
        const parsed = account.account.data.parsed.info
        const mint: string = parsed.mint
        const amount = parsed.tokenAmount

        // Skip zero balances and dust
        if (amount.uiAmount === 0 || amount.uiAmount === null) continue

        const meta = TOKEN_META[mint]
        tokens.push({
          mint,
          symbol: meta?.symbol || mint.slice(0, 4) + "...",
          name: meta?.name || "Unknown Token",
          balance: amount.uiAmount,
        })
      }
    }

    return NextResponse.json({
      address,
      solBalance,
      tokens,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error("Solana RPC error:", error)
    const message = error instanceof Error ? error.message : "Failed to fetch wallet data"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
