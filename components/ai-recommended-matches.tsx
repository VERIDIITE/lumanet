"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, MapPin, Star, Briefcase, Clock, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AIRecommendation {
  collaboratorId: string
  matchScore: number
  reasoning: string
  keyStrengths: string[]
  potentialConcerns?: string[]
  recommendationLevel: "highly_recommended" | "recommended" | "good_fit" | "potential_fit"
  collaborator: {
    id: string
    name: string
    role: string
    location: string
    bio: string
    skills: string[]
    rating: number
    matchScore: number
    avatar: string
    availability: string
    experience: string
    portfolio: number
    profileUrl?: string
  }
}

interface AIRecommendedMatchesProps {
  projectId: string
  limit?: number
}

export function AIRecommendedMatches({ projectId, limit = 6 }: AIRecommendedMatchesProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecommendations()
  }, [projectId])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/ai-recommendations?projectId=${projectId}&limit=${limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommendations")
      }

      setRecommendations(data.recommendations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (level: string) => {
    switch (level) {
      case "highly_recommended":
        return "bg-green-100 text-green-800 border-green-200"
      case "recommended":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "good_fit":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "potential_fit":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRecommendationLabel = (level: string) => {
    switch (level) {
      case "highly_recommended":
        return "Highly Recommended"
      case "recommended":
        return "Recommended"
      case "good_fit":
        return "Good Fit"
      case "potential_fit":
        return "Potential Fit"
      default:
        return "Match"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommended Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommended Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchRecommendations} variant="outline" className="mt-4 bg-transparent">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Recommended Matches
          <Badge variant="secondary" className="ml-auto">
            {recommendations.length} matches found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {recommendations.map((rec) => (
            <div key={rec.collaboratorId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={rec.collaborator.avatar || "/placeholder.svg"} alt={rec.collaborator.name} />
                  <AvatarFallback>
                    {rec.collaborator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{rec.collaborator.name}</h3>
                      <p className="text-sm text-muted-foreground">{rec.collaborator.role}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={getRecommendationColor(rec.recommendationLevel)}>
                        {getRecommendationLabel(rec.recommendationLevel)}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {rec.matchScore}% match
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {rec.collaborator.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {rec.collaborator.rating}/5
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {rec.collaborator.portfolio} projects
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.collaborator.availability}
                    </div>
                  </div>

                  <p className="text-sm mb-3 text-muted-foreground">{rec.reasoning}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {rec.keyStrengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>

                  {rec.potentialConcerns && rec.potentialConcerns.length > 0 && (
                    <div className="text-xs text-amber-600 mb-3">
                      <strong>Consider:</strong> {rec.potentialConcerns.join(", ")}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Send Collaboration Request
                    </Button>
                    {rec.collaborator.profileUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={rec.collaborator.profileUrl} target="_blank" rel="noopener noreferrer">
                          View Profile
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
