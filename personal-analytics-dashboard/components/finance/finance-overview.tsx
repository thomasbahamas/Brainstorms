"use client"

import { useAppStore, FinanceEntry } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
  Repeat,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function FinanceOverview() {
  const { finances, addFinanceEntry, deleteFinanceEntry } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newEntry, setNewEntry] = useState({ type: "income" as "income" | "expense", category: "", amount: "", description: "" })

  const income = finances.filter((f) => f.type === "income")
  const expenses = finances.filter((f) => f.type === "expense")
  const totalIncome = income.reduce((s, f) => s + f.amount, 0)
  const totalExpenses = expenses.reduce((s, f) => s + f.amount, 0)
  const netCashflow = totalIncome - totalExpenses
  const recurringIncome = income.filter((f) => f.recurring).reduce((s, f) => s + f.amount, 0)
  const recurringExpenses = expenses.filter((f) => f.recurring).reduce((s, f) => s + f.amount, 0)

  // Group by category
  const incomeByCategory = income.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + f.amount
    return acc
  }, {} as Record<string, number>)

  const expenseByCategory = expenses.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + f.amount
    return acc
  }, {} as Record<string, number>)

  const handleAdd = () => {
    if (!newEntry.category || !newEntry.amount || !newEntry.description) {
      toast("Fill in all fields", "error")
      return
    }
    addFinanceEntry({
      id: `f${Date.now()}`,
      type: newEntry.type,
      category: newEntry.category,
      amount: parseFloat(newEntry.amount),
      description: newEntry.description,
      date: new Date().toISOString().split("T")[0],
    })
    toast("Transaction added")
    setNewEntry({ type: "income", category: "", amount: "", description: "" })
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    deleteFinanceEntry(id)
    toast("Transaction deleted")
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-400">Income</span>
          </div>
          <p className="text-xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
          <p className="text-[10px] text-gray-500 mt-1">{income.length} transactions</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-xs text-gray-400">Expenses</span>
          </div>
          <p className="text-xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          <p className="text-[10px] text-gray-500 mt-1">{expenses.length} transactions</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-white" />
            <span className="text-xs text-gray-400">Net Cashflow</span>
          </div>
          <p className={cn("text-xl font-bold", netCashflow >= 0 ? "text-green-400" : "text-red-400")}>
            {formatCurrency(netCashflow)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">{((netCashflow / totalIncome) * 100).toFixed(0)}% margin</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-400">Recurring Net</span>
          </div>
          <p className={cn("text-xl font-bold", recurringIncome - recurringExpenses >= 0 ? "text-purple-400" : "text-red-400")}>
            {formatCurrency(recurringIncome - recurringExpenses)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">/month baseline</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-green-400" />
            Income Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(incomeByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{cat}</span>
                    <span className="text-xs font-bold text-green-400">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      style={{ width: `${(amount / totalIncome) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-red-400" />
            Expense Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(expenseByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{cat}</span>
                    <span className="text-xs font-bold text-red-400">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add Entry */}
      {showAdd ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setNewEntry({ ...newEntry, type: "income" })}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-bold", newEntry.type === "income" ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-500")}
            >
              Income
            </button>
            <button
              onClick={() => setNewEntry({ ...newEntry, type: "expense" })}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-bold", newEntry.type === "expense" ? "bg-red-500/20 text-red-400" : "bg-gray-800 text-gray-500")}
            >
              Expense
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input value={newEntry.category} onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })} placeholder="Category" className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" />
            <input value={newEntry.amount} onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })} placeholder="Amount" type="number" className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" />
            <input value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} placeholder="Description" className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500">Add</button>
            <button onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-2.5 text-sm text-gray-500 hover:border-purple-500/50 hover:text-purple-400">
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
      )}

      {/* Recent Transactions */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <h3 className="text-sm font-bold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {finances
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry) => (
              <div key={entry.id} className="group flex items-center gap-3 rounded-lg bg-gray-900/50 px-3 py-2.5 border border-gray-800/50">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", entry.type === "income" ? "bg-green-500/10" : "bg-red-500/10")}>
                  {entry.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{entry.description}</p>
                  <p className="text-[10px] text-gray-500">{entry.category} · {entry.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn("text-sm font-bold", entry.type === "income" ? "text-green-400" : "text-red-400")}>
                    {entry.type === "income" ? "+" : "-"}{formatCurrency(entry.amount)}
                  </p>
                  {entry.recurring && <p className="text-[10px] text-purple-400">recurring</p>}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 rounded p-1 text-gray-600 hover:text-red-400 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
