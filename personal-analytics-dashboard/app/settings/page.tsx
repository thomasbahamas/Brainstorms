"use client"

import { ModuleLayout } from "@/components/unified/module-layout"
import { useAppStore } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import { Settings, Wallet, Save, Trash2 } from "lucide-react"
import { useState } from "react"

const settingsModule = {
  id: "settings",
  name: "Settings",
  shortName: "Settings",
  description: "Configure your UNIFIED Protocol",
  icon: Settings,
  gradient: "from-gray-500 to-gray-600",
  href: "/settings",
  category: "system" as const,
  status: "active" as const,
}

export default function SettingsPage() {
  const { walletAddress, setWalletAddress } = useAppStore()
  const [address, setAddress] = useState(walletAddress)

  const handleSave = () => {
    setWalletAddress(address.trim())
    toast(address.trim() ? "Wallet address saved — crypto page will use live data" : "Wallet address cleared — using mock data")
  }

  const handleClear = () => {
    setAddress("")
    setWalletAddress("")
    toast("Wallet address cleared")
  }

  return (
    <ModuleLayout module={settingsModule}>
      <div className="max-w-2xl space-y-8">
        {/* Wallet */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Solana Wallet</h2>
              <p className="text-xs text-gray-500">Connect your wallet for live crypto data</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Wallet Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your Solana wallet address (e.g. 7xKXtg...)"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white font-mono placeholder-gray-500 outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
              >
                <Save className="h-4 w-4" /> Save
              </button>
              {walletAddress && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:border-red-500/30"
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-600">
              Your wallet address is stored locally in your browser. It&apos;s only used to fetch public on-chain data (balances and token accounts) — no private keys or signing involved.
            </p>
          </div>
        </section>

        {/* About */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-sm font-bold text-white mb-2">About</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            UNIFIED Protocol v3.0 — A personal operating system for crypto traders and content creators.
            All data is stored locally in your browser using localStorage. No accounts, no servers, no tracking.
          </p>
        </section>
      </div>
    </ModuleLayout>
  )
}
