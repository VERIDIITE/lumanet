"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Star, Mail, Play, ChevronLeft, ChevronRight, Award } from "lucide-react"

interface CollaboratorProfile {
  id: string
  name: string
  role: string
  location: string
  bio: string
  avatar?: string
  rating: number
  availability: string
  skills: string[]
  experience: string
  portfolio: {
    id: string
    title: string
    type: string
    year: string
    description: string
    thumbnail: string
    videoUrl?: string
    images: string[]
    role: string
    awards?: string[]
  }[]
  testimonials: {
    id: string
    name: string
    role: string
    company: string
    text: string
    rating: number
    avatar?: string
  }[]
  contact: {
    email: string
    phone?: string
    website?: string
  }
  stats: {
    projectsCompleted: number
    yearsExperience: number
    collaborators: number
    awards: number
  }
}

interface CollaboratorProfileViewProps {
  collaboratorId: string
  onBack: () => void
}

export function CollaboratorProfileView({ collaboratorId, onBack }: CollaboratorProfileViewProps) {
  const [profile, setProfile] = useState<CollaboratorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [collaboratorId])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/collaborators/${collaboratorId}/profile`)
      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextPortfolioItem = () => {
    if (profile && profile.portfolio.length > 0) {
      setCurrentPortfolioIndex((prev) => (prev + 1) % profile.portfolio.length)
    }
  }

  const prevPortfolioItem = () => {
    if (profile && profile.portfolio.length > 0) {
      setCurrentPortfolioIndex((prev) => (prev - 1 + profile.portfolio.length) % profile.portfolio.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white">Profile not found</p>
          <Button onClick={onBack} className="bg-white text-black hover:bg-white/90">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const currentPortfolioItem = profile.portfolio[currentPortfolioIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white/80 hover:text-white hover:bg-white/10 font-medium tracking-wide"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO DASHBOARD
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 font-medium tracking-wide"
              >
                <Mail className="w-4 h-4 mr-2" />
                MESSAGE
              </Button>
              <Button className="bg-white text-black hover:bg-white/90 font-medium tracking-wide">CONNECT</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <Card className="bg-black/60 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-8">
                <Avatar className="w-32 h-32 border-2 border-white/20">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white/10 text-white text-2xl font-medium">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{profile.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-blue-600 text-white font-medium tracking-wide px-3 py-1">
                        {profile.role.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{profile.location}</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-lg leading-relaxed max-w-3xl">{profile.bio}</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium text-lg">{profile.rating}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-medium tracking-wide ${
                        profile.availability === "available"
                          ? "text-green-300 border-green-300/50 bg-green-900/30"
                          : profile.availability === "busy"
                            ? "text-yellow-300 border-yellow-300/50 bg-yellow-900/30"
                            : "text-red-300 border-red-300/50 bg-red-900/30"
                      }`}
                    >
                      {profile.availability.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{profile.stats.projectsCompleted}</div>
                      <div className="text-sm text-white/60 font-medium tracking-wide">PROJECTS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{profile.stats.yearsExperience}</div>
                      <div className="text-sm text-white/60 font-medium tracking-wide">YEARS EXP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{profile.stats.collaborators}</div>
                      <div className="text-sm text-white/60 font-medium tracking-wide">COLLABORATORS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{profile.stats.awards}</div>
                      <div className="text-sm text-white/60 font-medium tracking-wide">AWARDS</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/80 border border-white/20 p-1">
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10 font-medium tracking-wide"
            >
              PORTFOLIO
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10 font-medium tracking-wide"
            >
              EXPERIENCE
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10 font-medium tracking-wide"
            >
              TESTIMONIALS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-8">
            {/* Featured Portfolio Item */}
            {currentPortfolioItem && (
              <Card className="bg-black/60 border-white/20 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-black/80 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={
                        currentPortfolioItem.thumbnail ||
                        "/placeholder.svg?height=400&width=800&query=cinematic film still"
                      }
                      alt={currentPortfolioItem.title}
                      className="w-full h-full object-cover"
                    />
                    {currentPortfolioItem.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          PLAY REEL
                        </Button>
                      </div>
                    )}

                    {/* Navigation */}
                    {profile.portfolio.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevPortfolioItem}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextPortfolioItem}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{currentPortfolioItem.title}</h3>
                        <div className="flex items-center gap-4 text-white/60">
                          <span className="font-medium">{currentPortfolioItem.type}</span>
                          <span>•</span>
                          <span>{currentPortfolioItem.year}</span>
                          <span>•</span>
                          <Badge className="bg-blue-600 text-white font-medium">
                            {currentPortfolioItem.role.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-white/60">
                        {currentPortfolioIndex + 1} / {profile.portfolio.length}
                      </div>
                    </div>

                    <p className="text-white/80 leading-relaxed mb-6">{currentPortfolioItem.description}</p>

                    {currentPortfolioItem.awards && currentPortfolioItem.awards.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentPortfolioItem.awards.map((award, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-yellow-300 border-yellow-300/50 bg-yellow-900/30 font-medium"
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {award}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.portfolio.map((item, index) => (
                <Card
                  key={item.id}
                  className={`bg-black/60 border-white/20 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-black/70 ${
                    index === currentPortfolioIndex ? "ring-2 ring-white/50" : ""
                  }`}
                  onClick={() => setCurrentPortfolioIndex(index)}
                >
                  <div className="aspect-video bg-black/80 overflow-hidden">
                    <img
                      src={item.thumbnail || "/placeholder.svg?height=200&width=300&query=film production still"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-white/60">
                      {item.type} • {item.year}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card className="bg-black/60 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-medium tracking-wide">PROFESSIONAL EXPERIENCE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 leading-relaxed text-lg">{profile.experience}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium tracking-wide">CORE SKILLS</h4>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-white border-white/40 bg-black/60 font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-black/60 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12 border border-white/20">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-white">{testimonial.name}</h4>
                        <p className="text-sm text-white/60">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">{testimonial.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
