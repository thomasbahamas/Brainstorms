"use client"

import { useAppStore, JournalEntry } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import {
  BookOpen,
  Plus,
  Smile,
  Meh,
  Frown,
  Star,
  ChevronDown,
  Trash2,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { format } from "date-fns"

const MOOD_CONFIG = {
  great: { icon: "🔥", label: "Great", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  good: { icon: "😊", label: "Good", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  okay: { icon: "😐", label: "Okay", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  bad: { icon: "😔", label: "Bad", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  terrible: { icon: "😩", label: "Terrible", color: "text-red-400 bg-red-500/10 border-red-500/30" },
}

const JOURNAL_PROMPTS = [
  "What was the biggest win today?",
  "What would you do differently?",
  "What are you most grateful for?",
  "What's your #1 priority for tomorrow?",
  "What did you learn today?",
  "What energized you the most?",
  "What drained your energy?",
]

export function DailyJournal() {
  const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(journal[0]?.id || null)
  const today = format(new Date(), "yyyy-MM-dd")
  const hasToday = journal.some((j) => j.date === today)

  const [newEntry, setNewEntry] = useState<{
    mood: JournalEntry["mood"]
    wins: string
    challenges: string
    gratitude: string
    tomorrowFocus: string
  }>({
    mood: "good",
    wins: "",
    challenges: "",
    gratitude: "",
    tomorrowFocus: "",
  })

  const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ mood: "good" as JournalEntry["mood"], wins: "", challenges: "", gratitude: "", tomorrowFocus: "" })

  const handleAdd = () => {
    if (!newEntry.wins && !newEntry.gratitude) {
      toast("Add at least one win or gratitude note", "error")
      return
    }
    addJournalEntry({
      id: `j${Date.now()}`,
      date: today,
      mood: newEntry.mood,
      wins: newEntry.wins.split("\n").filter(Boolean),
      challenges: newEntry.challenges.split("\n").filter(Boolean),
      gratitude: newEntry.gratitude,
      tomorrowFocus: newEntry.tomorrowFocus,
      createdAt: new Date().toISOString(),
    })
    toast("Journal entry saved")
    setNewEntry({ mood: "good", wins: "", challenges: "", gratitude: "", tomorrowFocus: "" })
    setShowAdd(false)
  }

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id)
    setEditData({
      mood: entry.mood,
      wins: entry.wins.join("\n"),
      challenges: entry.challenges.join("\n"),
      gratitude: entry.gratitude,
      tomorrowFocus: entry.tomorrowFocus,
    })
  }

  const handleSaveEdit = (id: string) => {
    updateJournalEntry(id, {
      mood: editData.mood,
      wins: editData.wins.split("\n").filter(Boolean),
      challenges: editData.challenges.split("\n").filter(Boolean),
      gratitude: editData.gratitude,
      tomorrowFocus: editData.tomorrowFocus,
    })
    toast("Journal entry updated")
    setEditingId(null)
  }

  const handleDeleteEntry = (id: string) => {
    deleteJournalEntry(id)
    toast("Journal entry deleted")
  }

  return (
    <div className="space-y-4">
      {/* Today's prompt */}
      {!hasToday && !showAdd && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">Daily Prompt</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">{randomPrompt}</p>
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs text-amber-400 hover:text-amber-300 transition"
          >
            Write today&apos;s entry &rarr;
          </button>
        </div>
      )}

      {/* Add Entry Form */}
      {showAdd && (
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-400" />
            {format(new Date(), "EEEE, MMMM d")}
          </h3>

          {/* Mood picker */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">How was your day?</label>
            <div className="flex gap-2">
              {(Object.keys(MOOD_CONFIG) as JournalEntry["mood"][]).map((mood) => {
                const config = MOOD_CONFIG[mood]
                return (
                  <button
                    key={mood}
                    onClick={() => setNewEntry({ ...newEntry, mood })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition",
                      newEntry.mood === mood
                        ? config.color
                        : "border-gray-700 text-gray-500 hover:border-gray-600"
                    )}
                  >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Wins */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Wins (one per line)
            </label>
            <textarea
              value={newEntry.wins}
              onChange={(e) => setNewEntry({ ...newEntry, wins: e.target.value })}
              placeholder="What went well today?"
              rows={2}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Challenges (one per line)
            </label>
            <textarea
              value={newEntry.challenges}
              onChange={(e) => setNewEntry({ ...newEntry, challenges: e.target.value })}
              placeholder="What was tough?"
              rows={2}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none"
            />
          </div>

          {/* Gratitude */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Gratitude</label>
            <input
              value={newEntry.gratitude}
              onChange={(e) => setNewEntry({ ...newEntry, gratitude: e.target.value })}
              placeholder="What are you grateful for?"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>

          {/* Tomorrow Focus */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Tomorrow&apos;s #1 Focus
            </label>
            <input
              value={newEntry.tomorrowFocus}
              onChange={(e) => setNewEntry({ ...newEntry, tomorrowFocus: e.target.value })}
              placeholder="What's the ONE thing for tomorrow?"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500"
            >
              Save Entry
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Past entries */}
      {journal
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((entry) => {
          const mood = MOOD_CONFIG[entry.mood]
          const isExpanded = expandedId === entry.id

          return (
            <div
              key={entry.id}
              className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-white/5 transition"
              >
                <span className="text-xl">{mood.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">
                    {format(new Date(entry.date), "EEEE, MMMM d")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mood.label} · {entry.wins.length} win{entry.wins.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {isExpanded && editingId === entry.id && (
                <div className="border-t border-gray-800 p-4 space-y-3">
                  <div className="flex gap-2">
                    {(Object.keys(MOOD_CONFIG) as JournalEntry["mood"][]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEditData({ ...editData, mood: m })}
                        className={cn("rounded-lg border px-2 py-1 text-xs transition", editData.mood === m ? MOOD_CONFIG[m].color : "border-gray-700 text-gray-500")}
                      >
                        {MOOD_CONFIG[m].icon} {MOOD_CONFIG[m].label}
                      </button>
                    ))}
                  </div>
                  <textarea value={editData.wins} onChange={(e) => setEditData({ ...editData, wins: e.target.value })} placeholder="Wins (one per line)" rows={2} className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none resize-none" />
                  <textarea value={editData.challenges} onChange={(e) => setEditData({ ...editData, challenges: e.target.value })} placeholder="Challenges (one per line)" rows={2} className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none resize-none" />
                  <input value={editData.gratitude} onChange={(e) => setEditData({ ...editData, gratitude: e.target.value })} placeholder="Gratitude" className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none" />
                  <input value={editData.tomorrowFocus} onChange={(e) => setEditData({ ...editData, tomorrowFocus: e.target.value })} placeholder="Tomorrow's focus" className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(entry.id)} className="rounded bg-purple-600 px-3 py-1.5 text-xs text-white hover:bg-purple-500">Save</button>
                    <button onClick={() => setEditingId(null)} className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancel</button>
                  </div>
                </div>
              )}
              {isExpanded && editingId !== entry.id && (
                <div className="border-t border-gray-800 p-4 space-y-3">
                  {entry.wins.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-green-400 uppercase mb-1">Wins</p>
                      {entry.wins.map((w, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="h-1 w-1 rounded-full bg-green-400" />
                          {w}
                        </div>
                      ))}
                    </div>
                  )}
                  {entry.challenges.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Challenges</p>
                      {entry.challenges.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="h-1 w-1 rounded-full bg-orange-400" />
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                  {entry.gratitude && (
                    <div>
                      <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Gratitude</p>
                      <p className="text-sm text-gray-300">{entry.gratitude}</p>
                    </div>
                  )}
                  {entry.tomorrowFocus && (
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Tomorrow&apos;s Focus</p>
                      <p className="text-sm text-gray-300">{entry.tomorrowFocus}</p>
                    </div>
                  )}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(entry)}
                      className="text-gray-600 hover:text-purple-400 transition"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-gray-600 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

      {!showAdd && !hasToday && journal.length === 0 && (
        <button
          onClick={() => setShowAdd(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-3 text-sm text-gray-500 hover:border-purple-500/50 hover:text-purple-400 transition"
        >
          <Plus className="h-4 w-4" /> Write Today&apos;s Entry
        </button>
      )}
    </div>
  )
}
