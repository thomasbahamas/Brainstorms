"use client"

import { useAppStore, KnowledgeNote } from "@/lib/store"
import {
  Pin,
  PinOff,
  BookOpen,
  Bookmark,
  Lightbulb,
  FlaskConical,
  Tag,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const CATEGORY_CONFIG = {
  note: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
  bookmark: { icon: Bookmark, color: "text-green-400", bg: "bg-green-500/10" },
  idea: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  research: { icon: FlaskConical, color: "text-purple-400", bg: "bg-purple-500/10" },
}

function NoteCard({ note }: { note: KnowledgeNote }) {
  const { togglePinNote, deleteNote } = useAppStore()
  const cat = CATEGORY_CONFIG[note.category]
  const CatIcon = cat.icon

  return (
    <div className={cn("group rounded-xl border bg-gray-900/50 p-4 transition-all hover:border-gray-600", note.pinned ? "border-purple-500/30" : "border-gray-800")}>
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cat.bg)}>
          <CatIcon className={cn("h-4 w-4", cat.color)} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white leading-tight">{note.title}</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">{note.createdAt}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => togglePinNote(note.id)} className="rounded p-1 text-gray-500 hover:text-purple-400">
            {note.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => deleteNote(note.id)} className="rounded p-1 text-gray-500 hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-3">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag className="h-3 w-3 text-gray-600" />
          {note.tags.map((tag) => (
            <span key={tag} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {note.pinned && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-400">
          <Pin className="h-3 w-3" />
          Pinned
        </div>
      )}
    </div>
  )
}

export function KnowledgeBase() {
  const { notes, addNote } = useAppStore()
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "note" as KnowledgeNote["category"], tags: "" })

  const filtered = notes
    .filter((n) => {
      if (filterCategory && n.category !== filterCategory) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.includes(q))
        )
      }
      return true
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const handleAdd = () => {
    if (!newNote.title || !newNote.content) return
    addNote({
      id: `n${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split("T")[0],
      pinned: false,
    })
    setNewNote({ title: "", content: "", category: "note", tags: "" })
    setShowAdd(false)
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setFilterCategory(null)}
          className={cn("rounded-xl border bg-gray-900/50 p-4 text-center transition", !filterCategory ? "border-purple-500/50" : "border-gray-800 hover:border-gray-700")}
        >
          <p className="text-2xl font-bold text-white">{notes.length}</p>
          <p className="text-xs text-gray-500">All</p>
        </button>
        {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((cat) => {
          const conf = CATEGORY_CONFIG[cat]
          const count = notes.filter((n) => n.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={cn("rounded-xl border bg-gray-900/50 p-4 text-center transition", filterCategory === cat ? "border-purple-500/50" : "border-gray-800 hover:border-gray-700")}
            >
              <p className={cn("text-2xl font-bold", conf.color)}>{count}</p>
              <p className="text-xs text-gray-500 capitalize">{cat}s</p>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, tags, content..."
            className="w-full rounded-lg border border-gray-700 bg-gray-900 pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500"
          />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
        >
          {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAdd ? "Cancel" : "New Note"}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
          <input value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} placeholder="Title" className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" />
          <textarea value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} placeholder="Content..." rows={3} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none" />
          <div className="flex gap-2">
            <select value={newNote.category} onChange={(e) => setNewNote({ ...newNote, category: e.target.value as KnowledgeNote["category"] })} className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none">
              <option value="note">Note</option>
              <option value="bookmark">Bookmark</option>
              <option value="idea">Idea</option>
              <option value="research">Research</option>
            </select>
            <input value={newNote.tags} onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })} placeholder="Tags (comma separated)" className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" />
            <button onClick={handleAdd} className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500">Save</button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 rounded-xl border border-dashed border-gray-800 p-12 text-center text-gray-500">
            {search || filterCategory ? "No notes match your search" : "No notes yet — start capturing ideas"}
          </div>
        )}
      </div>
    </div>
  )
}
