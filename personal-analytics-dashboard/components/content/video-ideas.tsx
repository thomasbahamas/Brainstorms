'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoIdea } from "@/types"
import { formatNumber } from "@/lib/utils"
import { Video, Zap, Eye, Calendar } from "lucide-react"

interface VideoIdeasProps {
  ideas: VideoIdea[]
}

export function VideoIdeas({ ideas }: VideoIdeasProps) {
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
      case 'published': return 'text-green-500'
      case 'editing': return 'text-purple-500'
      case 'filming': return 'text-blue-500'
      case 'planned': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-500" />
          Solana Floor Video Ideas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ideas.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No video ideas yet</p>
          ) : (
            ideas.map((idea) => (
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
                      <span className={`text-xs ${getStatusColor(idea.status)}`}>
                        {idea.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-gray-400">{idea.topic}</p>
                  </div>
                </div>

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
        </div>
      </CardContent>
    </Card>
  )
}
