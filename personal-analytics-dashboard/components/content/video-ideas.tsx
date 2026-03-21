'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore, VideoIdeaStore } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import { formatNumber } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Video, Zap, Eye, Calendar, Plus, ChevronRight, Trash2 } from "lucide-react"
import { useState } from "react"

const STATUS_FLOW: VideoIdeaStore["status"][] = ["idea", "planned", "filming", "editing", "published"]

export function VideoIdeas() {
  const { videoIdeas, updateVideoIdea, addVideoIdea, deleteVideoIdea } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newIdea, setNewIdea] = useState({ title: "", topic: "" })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      case 'low': return 'bg-green-500/10 border-green-500/30 text-green-400'
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 border-green-500/30 text-green-400'
      case 'editing': return 'bg-purple-500/10 border-purple-500/30 text-purple-400'
      case 'filming': return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      case 'planned': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  const cycleStatus = (id: string, currentStatus: VideoIdeaStore["status"]) => {
    const idx = STATUS_FLOW.indexOf(currentStatus)
    const next = STATUS_FLOW[(idx + 1) % STATUS_FLOW.length]
    updateVideoIdea(id, { status: next })
  }

  const handleDelete = (id: string) => {
    deleteVideoIdea(id)
    toast("Video idea deleted")
  }

  const handleAdd = () => {
    if (!newIdea.title) {
      toast("Enter a video title", "error")
      return
    }
    addVideoIdea({
      id: `v${Date.now()}`,
      title: newIdea.title,
      topic: newIdea.topic || "General",
      priority: "medium",
      estimatedViews: 0,
      trendinessScore: 0,
      relatedNarratives: [],
      hooks: [],
      keyPoints: [],
      status: "idea",
    })
    toast("Video idea added")
    setNewIdea({ title: "", topic: "" })
    setShowAdd(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-500" />
          Content Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Status summary */}
          <div className="flex gap-2 mb-4">
            {STATUS_FLOW.map((status) => {
              const count = videoIdeas.filter((v) => v.status === status).length
              return (
                <div
                  key={status}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-1.5 text-center",
                    getStatusColor(status)
                  )}
                >
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-[10px] capitalize">{status}</p>
                </div>
              )
            })}
          </div>

          {videoIdeas.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No video ideas yet</p>
          ) : (
            videoIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all border border-gray-700 hover:border-purple-500/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(idea.priority)}`}>
                        {idea.priority}
                      </span>
                      <button
                        onClick={() => cycleStatus(idea.id, idea.status)}
                        className={cn(
                          "text-xs px-2 py-1 rounded border flex items-center gap-1 hover:opacity-80 transition",
                          getStatusColor(idea.status)
                        )}
                        title="Click to advance status"
                      >
                        {idea.status}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="ml-auto rounded p-1 text-gray-600 hover:text-red-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-gray-400">{idea.topic}</p>
                  </div>
                </div>

                {(idea.estimatedViews > 0 || idea.trendinessScore > 0) && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500">Est. Views</p>
                        <p className="text-sm font-semibold text-white">
                          {formatNumber(idea.estimatedViews)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-500">Trending Score</p>
                        <p className="text-sm font-semibold text-white">
                          {idea.trendinessScore}/100
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {idea.hooks.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Hooks:</p>
                    <div className="space-y-1">
                      {idea.hooks.map((hook, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5" />
                          <p className="text-sm text-gray-300">{hook}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {idea.relatedNarratives.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Related Narratives:</p>
                    <div className="flex flex-wrap gap-1">
                      {idea.relatedNarratives.map((narrative) => (
                        <span
                          key={narrative}
                          className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        >
                          {narrative}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {idea.deadline && (
                  <div className="pt-3 border-t border-gray-700 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-400">Deadline:</span>
                    <span className="text-white font-medium">{idea.deadline}</span>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Add video idea */}
          {showAdd ? (
            <div className="rounded-lg border border-gray-700 bg-gray-900/80 p-3 space-y-2">
              <input
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                placeholder="Video title"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <input
                value={newIdea.topic}
                onChange={(e) => setNewIdea({ ...newIdea, topic: e.target.value })}
                placeholder="Topic"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500">
                  Add
                </button>
                <button onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-2.5 text-sm text-gray-500 hover:border-purple-500/50 hover:text-purple-400 transition"
            >
              <Plus className="h-4 w-4" /> Add Video Idea
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
