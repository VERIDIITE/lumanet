"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, Music, Users, Search, Plus, Star, MapPin, Calendar, Loader2, Sparkles } from "lucide-react"
import type { Collaborator, Project } from "@/lib/mock-data"
import { CollaborationRequests } from "./collaboration-requests"
import { CollaboratorProfileView } from "./collaborator-profile-view"

export function LumaNetDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("discover")
  const [showRequests, setShowRequests] = useState(false)
  const [manageMode, setManageMode] = useState<string | null>(null) // Added manage mode state for project management
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [projectType, setProjectType] = useState("all-types")
  const [aiRecommendedCollaborators, setAiRecommendedCollaborators] = useState<{ [projectId: string]: Collaborator[] }>(
    {},
  )
  const [projectForm, setProjectForm] = useState({
    title: "",
    type: "",
    description: "",
    budget: "",
    timeline: "",
    lookingFor: [],
  })
  const [showProfile, setShowProfile] = useState<string | null>(null) // Added profile view state

  useEffect(() => {
    loadCollaborators()
    loadProjects()
  }, [])

  const createStarsAnimation = () => {
    const container = document.body

    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div")
      star.className = "fixed pointer-events-none z-50"
      star.style.cssText = `
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        animation: projectStarErupt 2s ease-out forwards;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
      `

      container.appendChild(star)

      setTimeout(() => {
        if (container.contains(star)) {
          container.removeChild(star)
        }
      }, 2000)
    }
  }

  const loadCollaborators = async (search?: string, type?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (type && type !== "all-types") params.append("projectType", type)

      const response = await fetch(`/api/collaborators?${params}`)
      const data = await response.json()

      if (data.success) {
        const sortedCollaborators = data.collaborators.sort(
          (a: Collaborator, b: Collaborator) => (b.matchScore || 0) - (a.matchScore || 0),
        )
        setCollaborators(sortedCollaborators)
      }
    } catch (error) {
      console.error("Failed to load collaborators:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects?userId=user-1")
      const data = await response.json()

      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    }
  }

  const handleSearch = () => {
    loadCollaborators(searchTerm, projectType)
  }

  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.type || !projectForm.description) {
      alert("Please fill in all required fields")
      return
    }

    setCreatingProject(true) // Start creation animation

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...projectForm,
          userId: "user-1",
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }),
      })

      const data = await response.json()

      if (data.success) {
        createStarsAnimation()

        const recommendedCollaborators = await getAiRecommendedCollaborators(data.project.id, projectForm)

        if (recommendedCollaborators && recommendedCollaborators.length > 0) {
          await sendCollaborationRequests(data.project.id, recommendedCollaborators.slice(0, 5))
        }

        setTimeout(() => {
          alert(
            `Project created successfully! AI has selected ${recommendedCollaborators?.length || 0} perfect collaborators and sent requests automatically.`,
          )
          setProjectForm({
            title: "",
            type: "",
            description: "",
            budget: "",
            timeline: "",
            lookingFor: [],
          })
          loadProjects()
          setActiveTab("my-projects")
          setCreatingProject(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Failed to create project:", error)
      alert("Failed to create project")
      setCreatingProject(false)
    }
  }

  const getAiRecommendedCollaborators = async (projectId: string, projectData: any) => {
    try {
      const response = await fetch("/api/collaborators/ai-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          projectType: projectData.type,
          lookingFor: projectData.lookingFor,
          description: projectData.description,
          budget: projectData.budget,
          timeline: projectData.timeline,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAiRecommendedCollaborators((prev) => ({
          ...prev,
          [projectId]: data.recommendedCollaborators,
        }))
        return data.recommendedCollaborators
      }
    } catch (error) {
      console.error("Failed to get AI recommendations:", error)
    }
    return []
  }

  const sendCollaborationRequests = async (projectId: string, collaborators: Collaborator[]) => {
    const messages = [
      "I'd love to collaborate with you on my project! Your skills and experience would be perfect for what we're trying to achieve.",
      "Your portfolio caught my attention and I think you'd be an amazing fit for this project. Would you be interested in collaborating?",
      "I'm impressed by your work and would love to have you join our creative team for this exciting project.",
      "Your expertise in this area would be invaluable to our project. I'd love to discuss collaboration opportunities with you.",
      "I believe your creative vision would align perfectly with our project goals. Would you be interested in working together?",
    ]

    for (let i = 0; i < collaborators.length; i++) {
      try {
        await fetch("/api/collaboration-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            collaboratorId: collaborators[i].id,
            message: messages[i % messages.length],
          }),
        })
      } catch (error) {
        console.error(`Failed to send request to ${collaborators[i].name}:`, error)
      }
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const timeoutId = setTimeout(() => {
      loadCollaborators(value, projectType)
    }, 300)
    return () => clearTimeout(timeoutId)
  }

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value)
    loadCollaborators(searchTerm, value)
  }

  const handleConnect = async (collaboratorId: string) => {
    try {
      const response = await fetch("/api/collaboration-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projects[0]?.id || "1",
          collaboratorId,
          message: "I'd love to collaborate with you on my project!",
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Connection request sent!")
      }
    } catch (error) {
      console.error("Failed to send connection request:", error)
      alert("Failed to send connection request")
    }
  }

  const toggleRole = (role: string) => {
    setProjectForm((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(role)
        ? prev.lookingFor.filter((r) => r !== role)
        : [...prev.lookingFor, role],
    }))
  }

  const viewCollaboratorProfile = (collaboratorId: string) => {
    setShowProfile(collaboratorId) // Show profile view instead of routing
  }

  const handleBackToHome = () => {
    setShowRequests(false)
  }

  const handleShowRequests = () => {
    setShowRequests(true)
  }

  const handleRequestUpdate = () => {
    loadProjects()
  }

  const handleRemoveCollaborator = async (projectId: string, collaboratorId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators/${collaboratorId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        // Update the projects state to reflect the removal
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, collaborators: project.collaborators - 1 } : project,
          ),
        )

        // Update AI recommended collaborators to remove the collaborator
        setAiRecommendedCollaborators((prev) => ({
          ...prev,
          [projectId]: prev[projectId]?.filter((collab) => collab.id !== collaboratorId) || [],
        }))

        // Create a small animation effect
        const element = document.querySelector(`[data-collaborator-id="${collaboratorId}"]`)
        if (element) {
          element.classList.add("animate-pulse")
          setTimeout(() => {
            element.remove()
          }, 300)
        }
      }
    } catch (error) {
      console.error("Failed to remove collaborator:", error)
      alert("Failed to remove collaborator")
    }
  }

  const handleManageProject = (projectId: string) => {
    setManageMode(manageMode === projectId ? null : projectId)
  }

  const handleBackFromProfile = () => {
    setShowProfile(null) // Return to dashboard from profile
  }

  if (showProfile) {
    return <CollaboratorProfileView collaboratorId={showProfile} onBack={handleBackFromProfile} />
  }

  if (showRequests) {
    return <CollaborationRequests onBackToHome={handleBackToHome} onRequestUpdate={handleRequestUpdate} />
  }

  return (
    <>
      <style jsx global>{`
        @keyframes projectStarErupt {
          0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: scale(1.2) rotate(120deg);
          }
          70% {
            opacity: 0.8;
            transform: scale(0.8) rotate(240deg) translateY(-50px);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg) translateY(-150px);
          }
        }
        
        @keyframes createGlow {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        
        .create-animation {
          animation: createGlow 2s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-black font-bold text-xl">L</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wide">LUMANET</h1>
              </div>
              <nav className="flex items-center gap-8">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 font-medium tracking-wide"
                >
                  DASHBOARD
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 font-medium tracking-wide"
                >
                  PROJECTS
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowRequests}
                  className="text-white/80 hover:text-white hover:bg-white/10 font-medium tracking-wide"
                >
                  REQUESTS
                </Button>
                <Avatar className="w-10 h-10 border border-white/20">
                  <AvatarImage src="/user-avatar.jpg" />
                  <AvatarFallback className="bg-white/10 text-white">JD</AvatarFallback>
                </Avatar>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-8 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-black/80 border border-white/20 p-1">
              <TabsTrigger
                value="discover"
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10 font-medium tracking-wide"
              >
                <Search className="w-4 h-4" />
                DISCOVER
              </TabsTrigger>
              <TabsTrigger
                value="post-project"
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10 font-medium tracking-wide"
              >
                <Plus className="w-4 h-4" />
                POST PROJECT
              </TabsTrigger>
              <TabsTrigger
                value="my-projects"
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10 font-medium tracking-wide"
              >
                <Users className="w-4 h-4" />
                MY PROJECTS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-8">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-5xl font-bold text-white tracking-tight text-balance">
                  FIND YOUR PERFECT CREATIVE COLLABORATOR
                </h2>
                <p className="text-white/60 text-xl max-w-3xl mx-auto text-pretty font-light">
                  Connect with talented filmmakers and musicians using our AI-powered matching system
                </p>
              </div>

              <Card className="bg-black/60 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-xl font-medium tracking-wide">
                    <Sparkles className="w-6 h-6 text-white" />
                    AI-POWERED SEARCH
                  </CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Find the perfect match for your creative project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Search by skills, location, or name..."
                      className="flex-1 bg-black/40 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Select value={projectType} onValueChange={handleProjectTypeChange}>
                      <SelectTrigger className="w-48 bg-black/40 border-white/30 text-white">
                        <SelectValue placeholder="Project Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="all-types" className="text-white hover:bg-white/10">
                          All Types
                        </SelectItem>
                        <SelectItem value="film" className="text-white hover:bg-white/10">
                          Film
                        </SelectItem>
                        <SelectItem value="music" className="text-white hover:bg-white/10">
                          Music
                        </SelectItem>
                        <SelectItem value="both" className="text-white hover:bg-white/10">
                          Both
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleSearch}
                      disabled={loading}
                      className="bg-white text-black hover:bg-white/90 font-medium tracking-wide"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      SEARCH
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-white flex items-center gap-3 tracking-wide">
                  <Sparkles className="w-6 h-6 text-white" />
                  AI RECOMMENDED MATCHES
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <span className="ml-3 text-white/60 text-lg">Finding perfect matches...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collaborators.map((collaborator) => (
                      <Card
                        key={collaborator.id}
                        className="bg-black/60 border-white/20 hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-14 h-14 border border-white/20">
                                <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-white/10 text-white font-medium">
                                  {collaborator.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg text-white font-medium">{collaborator.name}</CardTitle>
                                <CardDescription className="text-white/60">{collaborator.role}</CardDescription>
                              </div>
                            </div>
                            <Badge className="bg-white text-black font-medium tracking-wide">
                              {collaborator.matchScore}% MATCH
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <MapPin className="w-4 h-4" />
                            {collaborator.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-white">{collaborator.rating}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ml-auto border font-medium tracking-wide ${
                                collaborator.availability === "available"
                                  ? "text-green-300 border-green-300/50 bg-green-900/30"
                                  : collaborator.availability === "busy"
                                    ? "text-yellow-300 border-yellow-300/50 bg-yellow-900/30"
                                    : "text-red-300 border-red-300/50 bg-red-900/30"
                              }`}
                            >
                              {collaborator.availability.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70 line-clamp-2">{collaborator.bio}</p>
                          <div className="flex flex-wrap gap-2">
                            {collaborator.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="outline"
                                className="text-xs text-white border-white/40 bg-black/60"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {collaborator.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs text-white border-white/40 bg-black/60">
                                +{collaborator.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-3 mt-6">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 font-medium tracking-wide"
                              onClick={() => viewCollaboratorProfile(collaborator.id)}
                            >
                              VIEW PROFILE
                            </Button>
                            <Button
                              className="flex-1 bg-white text-black hover:bg-white/90 font-medium tracking-wide"
                              onClick={() => handleConnect(collaborator.id)}
                              disabled={collaborator.availability === "unavailable"}
                            >
                              {collaborator.availability === "unavailable" ? "UNAVAILABLE" : "CONNECT"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="post-project" className="space-y-8">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-5xl font-bold text-white tracking-tight text-balance">
                  POST YOUR CREATIVE PROJECT
                </h2>
                <p className="text-white/60 text-xl max-w-3xl mx-auto text-pretty font-light">
                  Share your vision and let AI find the perfect collaborators for your project
                </p>
              </div>

              <Card
                className={`max-w-3xl mx-auto bg-black/60 border-white/20 backdrop-blur-sm ${creatingProject ? "create-animation" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="text-white text-xl font-medium tracking-wide">PROJECT DETAILS</CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Tell us about your creative project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white tracking-wide">PROJECT TITLE</label>
                    <Input
                      placeholder="Enter your project title..."
                      className="bg-black/40 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white tracking-wide">PROJECT TYPE</label>
                    <Select
                      value={projectForm.type}
                      onValueChange={(value) => setProjectForm((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-black/40 border-white/30 text-white">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="short-film" className="text-white hover:bg-white/10">
                          Short Film
                        </SelectItem>
                        <SelectItem value="feature-film" className="text-white hover:bg-white/10">
                          Feature Film
                        </SelectItem>
                        <SelectItem value="music-video" className="text-white hover:bg-white/10">
                          Music Video
                        </SelectItem>
                        <SelectItem value="documentary" className="text-white hover:bg-white/10">
                          Documentary
                        </SelectItem>
                        <SelectItem value="commercial" className="text-white hover:bg-white/10">
                          Commercial
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white tracking-wide">DESCRIPTION</label>
                    <Textarea
                      placeholder="Describe your project, vision, and what you're looking for in collaborators..."
                      rows={4}
                      className="bg-black/40 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white tracking-wide">BUDGET RANGE</label>
                      <Select
                        value={projectForm.budget}
                        onValueChange={(value) => setProjectForm((prev) => ({ ...prev, budget: value }))}
                      >
                        <SelectTrigger className="bg-black/40 border-white/30 text-white">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="0-1k" className="text-white hover:bg-white/10">
                            $0 - $1,000
                          </SelectItem>
                          <SelectItem value="1k-5k" className="text-white hover:bg-white/10">
                            $1,000 - $5,000
                          </SelectItem>
                          <SelectItem value="5k-10k" className="text-white hover:bg-white/10">
                            $5,000 - $10,000
                          </SelectItem>
                          <SelectItem value="10k+" className="text-white hover:bg-white/10">
                            $10,000+
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white tracking-wide">TIMELINE</label>
                      <Select
                        value={projectForm.timeline}
                        onValueChange={(value) => setProjectForm((prev) => ({ ...prev, timeline: value }))}
                      >
                        <SelectTrigger className="bg-black/40 border-white/30 text-white">
                          <SelectValue placeholder="Project timeline" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="1-month" className="text-white hover:bg-white/10">
                            1 Month
                          </SelectItem>
                          <SelectItem value="2-3-months" className="text-white hover:bg-white/10">
                            2-3 Months
                          </SelectItem>
                          <SelectItem value="3-6-months" className="text-white hover:bg-white/10">
                            3-6 Months
                          </SelectItem>
                          <SelectItem value="6-months+" className="text-white hover:bg-white/10">
                            6+ Months
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white tracking-wide">LOOKING FOR</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Director",
                        "Producer",
                        "Cinematographer",
                        "Editor",
                        "Sound Engineer",
                        "Composer",
                        "Writer",
                      ].map((role) => (
                        <Badge
                          key={role}
                          variant={projectForm.lookingFor.includes(role) ? "default" : "outline"}
                          className={`cursor-pointer font-medium tracking-wide transition-all ${
                            projectForm.lookingFor.includes(role)
                              ? "bg-white text-black hover:bg-white/90"
                              : "text-white border-white/30 bg-black/40 hover:bg-black/60 hover:text-white"
                          }`}
                          onClick={() => toggleRole(role)}
                        >
                          {role.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-white text-black hover:bg-white/90 font-medium tracking-wide text-base py-6"
                    size="lg"
                    onClick={handleCreateProject}
                    disabled={creatingProject}
                  >
                    {creatingProject ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        CREATING PROJECT & FINDING COLLABORATORS...
                      </>
                    ) : (
                      "POST PROJECT & FIND COLLABORATORS"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-projects" className="space-y-8">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-5xl font-bold text-white tracking-tight text-balance">YOUR CREATIVE PROJECTS</h2>
                <p className="text-white/60 text-xl max-w-3xl mx-auto text-pretty font-light">
                  Manage your active projects and collaboration requests
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-black/60 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-white font-medium">
                            {project.type.includes("film") ? (
                              <Film className="w-5 h-5" />
                            ) : (
                              <Music className="w-5 h-5" />
                            )}
                            {project.title}
                          </CardTitle>
                          <CardDescription className="capitalize text-white/60">
                            {project.type.replace("-", " ")}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={project.status === "active" ? "default" : "secondary"}
                          className="capitalize bg-white text-black font-medium tracking-wide"
                        >
                          {project.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>

                      {aiRecommendedCollaborators[project.id] && aiRecommendedCollaborators[project.id].length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white tracking-wide">
                              AI SELECTED COLLABORATORS
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {aiRecommendedCollaborators[project.id].slice(0, 3).map((collaborator) => (
                              <div
                                key={collaborator.id}
                                className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 border border-white/20"
                              >
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-white/20 text-white text-xs">
                                    {collaborator.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-white font-medium">{collaborator.name}</span>
                                <Badge className="text-xs bg-white text-black font-medium">
                                  {collaborator.matchScore}%
                                </Badge>
                              </div>
                            ))}
                            {aiRecommendedCollaborators[project.id].length > 3 && (
                              <Badge variant="outline" className="text-xs text-white border-white/40 bg-black/60">
                                +{aiRecommendedCollaborators[project.id].length - 3} more AI matches
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {project.lookingFor.map((role, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs text-white border-white/40 bg-black/60"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{project.collaborators} Collaborators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{project.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">{project.requests} new requests</span>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShowRequests}
                            className="bg-transparent border-white/20 text-white hover:bg-white/10 font-medium tracking-wide"
                          >
                            VIEW REQUESTS
                          </Button>
                          <Button
                            size="sm"
                            className="bg-white text-black hover:bg-white/90 font-medium tracking-wide"
                            onClick={() => handleManageProject(project.id)}
                          >
                            {manageMode === project.id ? "DONE" : "MANAGE"}
                          </Button>
                        </div>
                      </div>

                      {manageMode === project.id && aiRecommendedCollaborators[project.id] && (
                        <div className="mt-6 p-4 bg-black/40 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium text-white mb-4 tracking-wide">MANAGE COLLABORATORS</h4>
                          <div className="space-y-3">
                            {aiRecommendedCollaborators[project.id].map((collaborator) => (
                              <div
                                key={collaborator.id}
                                data-collaborator-id={collaborator.id}
                                className="flex items-center justify-between p-3 bg-black/60 rounded-lg border border-white/10"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-white/20 text-white text-xs">
                                      {collaborator.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="text-sm font-medium text-white">{collaborator.name}</span>
                                    <p className="text-xs text-white/60">{collaborator.role}</p>
                                  </div>
                                  <Badge className="text-xs bg-white text-black font-medium">
                                    {collaborator.matchScore}%
                                  </Badge>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveCollaborator(project.id, collaborator.id)}
                                  className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 font-medium tracking-wide"
                                >
                                  REMOVE
                                </Button>
                              </div>
                            ))}
                            {aiRecommendedCollaborators[project.id].length === 0 && (
                              <p className="text-sm text-white/60 text-center py-4">No collaborators to manage</p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {projects.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <p className="text-white/60 text-lg">No projects yet. Create your first project to get started!</p>
                    <Button
                      className="mt-6 bg-white text-black hover:bg-white/90 font-medium tracking-wide"
                      onClick={() => setActiveTab("post-project")}
                    >
                      CREATE PROJECT
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
