"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

export function RevenueChart() {
  const { finances } = useAppStore()

  // Group by category for income
  const incomeByCategory = finances
    .filter((f) => f.type === "income")
    .reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + f.amount
      return acc
    }, {} as Record<string, number>)

  const expenseByCategory = finances
    .filter((f) => f.type === "expense")
    .reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + f.amount
      return acc
    }, {} as Record<string, number>)

  // Build chart data for income sources
  const chartData = Object.entries(incomeByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
    }))

  const totalIncome = Object.values(incomeByCategory).reduce((s, v) => s + v, 0)
  const totalExpenses = Object.values(expenseByCategory).reduce((s, v) => s + v, 0)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">Total Income</p>
          <p className="text-lg font-bold text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">Total Expenses</p>
          <p className="text-lg font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">Savings Rate</p>
          <p className="text-lg font-bold text-purple-400">{savingsRate.toFixed(0)}%</p>
        </div>
      </div>

      {/* Revenue by source chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <h3 className="text-sm font-bold text-white mb-4">Revenue by Source</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
                stroke="#6b7280"
                fontSize={11}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={110}
                stroke="#6b7280"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => [formatCurrency(value as number), "Amount"]}
              />
              <Bar
                dataKey="amount"
                fill="url(#incomeGradient)"
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense breakdown chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <h3 className="text-sm font-bold text-white mb-4">Expense Breakdown</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => ({ category, amount }))}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${v}`}
                stroke="#6b7280"
                fontSize={11}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={100}
                stroke="#6b7280"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => [formatCurrency(value as number), "Amount"]}
              />
              <Bar
                dataKey="amount"
                fill="url(#expenseGradient)"
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
