"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Clock, MessageSquare, User, Calendar, Home, Sparkles } from "lucide-react"
import type { CollaborationRequest } from "@/lib/mock-data"

// Declare getStatusColor and getStatusIcon functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-900/30 text-green-300 border-green-300/50"
    case "declined":
      return "bg-red-900/30 text-red-300 border-red-300/50"
    case "pending":
      return "bg-yellow-900/30 text-yellow-300 border-yellow-300/50"
    default:
      return ""
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted":
      return <Check className="w-3 h-3 mr-1" />
    case "declined":
      return <X className="w-3 h-3 mr-1" />
    case "pending":
      return <Clock className="w-3 h-3 mr-1" />
    default:
      return null
  }
}

interface CollaborationRequestsProps {
  projectId?: string
  userId?: string
  onBackToHome?: () => void
  onRequestUpdate?: () => void
}

export function CollaborationRequests({
  projectId,
  userId,
  onBackToHome,
  onRequestUpdate,
}: CollaborationRequestsProps) {
  const [requests, setRequests] = useState<CollaborationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("received")
  const [animatingRequest, setAnimatingRequest] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/collaboration-requests")
      const data = await response.json()

      if (data.success) {
        setRequests(data.requests)
      }
    } catch (error) {
      console.error("Failed to load requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    setAnimatingRequest(requestId)

    // Create stars animation
    createStarsAnimation()

    try {
      const response = await fetch(`/api/collaboration-requests/${requestId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Remove request from list after animation
        setTimeout(() => {
          setRequests((prev) => prev.filter((req) => req.id !== requestId))
          setAnimatingRequest(null)
          onRequestUpdate?.()
        }, 1500)
      }
    } catch (error) {
      console.error("Failed to accept request:", error)
      setAnimatingRequest(null)
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    setAnimatingRequest(requestId)

    try {
      const response = await fetch(`/api/collaboration-requests/${requestId}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Remove request from list
        setTimeout(() => {
          setRequests((prev) => prev.filter((req) => req.id !== requestId))
          setAnimatingRequest(null)
          onRequestUpdate?.()
        }, 800)
      }
    } catch (error) {
      console.error("Failed to decline request:", error)
      setAnimatingRequest(null)
    }
  }

  const createStarsAnimation = () => {
    const container = document.body

    for (let i = 0; i < 20; i++) {
      const star = document.createElement("div")
      star.className = "fixed pointer-events-none z-50"
      star.style.cssText = `
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        animation: starErupt 1.5s ease-out forwards;
      `

      container.appendChild(star)

      setTimeout(() => {
        container.removeChild(star)
      }, 1500)
    }
  }

  const receivedRequests = requests.filter((req) => req.status === "pending" || req.status === "accepted")
  const sentRequests = requests.filter((req) => req.type === "sent")

  return (
    <>
      <style jsx global>{`
        @keyframes starErupt {
          0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg) translateY(-100px);
          }
        }
        
        @keyframes acceptGlow {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        
        .accept-animation {
          animation: acceptGlow 1.5s ease-out;
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div></div>
          <Button
            variant="outline"
            onClick={onBackToHome}
            className="flex items-center gap-2 border-white/20 text-white/70 hover:text-white hover:bg-white/10 bg-transparent"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-wide">COLLABORATION REQUESTS</h2>
          <p className="text-white/60 text-lg">Manage your collaboration requests and connect with creative partners</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/80 border border-white/20">
            <TabsTrigger
              value="received"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10"
            >
              <MessageSquare className="w-4 h-4" />
              RECEIVED ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-white hover:text-white hover:bg-white/10"
            >
              <User className="w-4 h-4" />
              SENT ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {receivedRequests.map((request) => (
              <Card
                key={request.id}
                className={`bg-black/60 border-white/20 backdrop-blur-sm transition-all duration-500 ${
                  animatingRequest === request.id ? "accept-animation" : "hover:bg-black/70"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border border-white/20">
                        <AvatarImage src={request.collaborator?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {request.collaborator?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-white">{request.collaborator?.name || "Unknown"}</CardTitle>
                        <CardDescription className="text-white/60">
                          {request.collaborator?.role || "Unknown Role"}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-white/60">for</span>
                          <Badge variant="outline" className="text-white border-white/40 bg-black/60">
                            {request.project?.title || "Unknown Project"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${
                          request.status === "accepted"
                            ? "bg-green-900/30 text-green-300 border-green-300/50"
                            : request.status === "declined"
                              ? "bg-red-900/30 text-red-300 border-red-300/50"
                              : "bg-yellow-900/30 text-yellow-300 border-yellow-300/50"
                        } border font-medium tracking-wide`}
                      >
                        {request.status === "accepted" && <Check className="w-3 h-3 mr-1" />}
                        {request.status === "declined" && <X className="w-3 h-3 mr-1" />}
                        {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">{request.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span>{request.createdAt}</span>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeclineRequest(request.id)}
                          disabled={animatingRequest === request.id}
                          className="bg-transparent border-white/20 text-white hover:bg-red-900/30 hover:border-red-300/50 hover:text-red-300"
                        >
                          <X className="w-4 h-4 mr-1" />
                          DECLINE
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={animatingRequest === request.id}
                          className="bg-white text-black hover:bg-white/90 font-medium tracking-wide"
                        >
                          {animatingRequest === request.id ? (
                            <>
                              <Sparkles className="w-4 h-4 mr-1 animate-spin" />
                              ACCEPTING...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              ACCEPT
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {receivedRequests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/60 text-lg">No collaboration requests yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentRequests.map((request) => (
              <Card
                key={request.id}
                className="bg-black/60 border-white/20 backdrop-blur-sm hover:bg-black/70 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.collaborator?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.collaborator?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.collaborator?.name || "Unknown"}</CardTitle>
                        <CardDescription>{request.collaborator?.role || "Unknown Role"}</CardDescription>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">for</span>
                          <Badge variant="outline">{request.project?.title || "Unknown Project"}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{request.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{request.createdAt}</span>
                    </div>
                    {request.status === "pending" && (
                      <span className="text-sm text-muted-foreground">Waiting for response...</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {sentRequests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/60 text-lg">No sent requests yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
