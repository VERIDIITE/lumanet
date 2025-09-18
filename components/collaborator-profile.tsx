"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, ExternalLink, Send, PenToolIcon as Portfolio, Award, Clock } from "lucide-react"
import type { Collaborator } from "@/lib/mock-data"

interface CollaboratorProfileProps {
  collaborator: Collaborator
  onConnect?: (collaboratorId: string, message: string) => void
}

export function CollaboratorProfile({ collaborator, onConnect }: CollaboratorProfileProps) {
  const [connectionMessage, setConnectionMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSendRequest = () => {
    if (onConnect && connectionMessage.trim()) {
      onConnect(collaborator.id, connectionMessage)
      setConnectionMessage("")
      setIsDialogOpen(false)
    }
  }

  const mockPortfolio = [
    {
      title: "Midnight Chronicles",
      type: "Short Film",
      role: "Director",
      year: "2023",
      description: "A psychological thriller exploring themes of identity and memory.",
    },
    {
      title: "Urban Beats",
      type: "Music Video",
      role: "Cinematographer",
      year: "2023",
      description: "High-energy music video with dynamic camera work and creative lighting.",
    },
    {
      title: "The Last Garden",
      type: "Documentary",
      role: "Producer",
      year: "2022",
      description: "Environmental documentary about urban farming initiatives.",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-32 h-32 mx-auto md:mx-0">
              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {collaborator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{collaborator.name}</h1>
                <p className="text-xl text-muted-foreground">{collaborator.role}</p>
                <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">{collaborator.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{collaborator.rating}</span>
                  <span className="text-sm text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Portfolio className="w-4 h-4" />
                  <span className="font-medium">{collaborator.portfolio}</span>
                  <span className="text-sm text-muted-foreground">projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="font-medium capitalize">{collaborator.experience}</span>
                </div>
                <Badge
                  variant={
                    collaborator.availability === "available"
                      ? "default"
                      : collaborator.availability === "busy"
                        ? "secondary"
                        : "destructive"
                  }
                  className="flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  {collaborator.availability}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {collaborator.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 md:flex-none" disabled={collaborator.availability === "unavailable"}>
                      <Send className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Connection Request</DialogTitle>
                      <DialogDescription>
                        Send a personalized message to {collaborator.name} about potential collaboration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Hi! I'd love to collaborate with you on my upcoming project. Here's what I have in mind..."
                        value={connectionMessage}
                        onChange={(e) => setConnectionMessage(e.target.value)}
                        rows={4}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendRequest} disabled={!connectionMessage.trim()}>
                          Send Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {collaborator.profileUrl && (
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {collaborator.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{collaborator.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaborator.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPortfolio.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>
                        {project.type} • {project.year}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{project.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {[
              {
                reviewer: "Sarah Mitchell",
                project: "Urban Dreams",
                rating: 5,
                comment: "Exceptional work! Their attention to detail and creative vision brought our project to life.",
                date: "2 weeks ago",
              },
              {
                reviewer: "David Chen",
                project: "Midnight Sessions",
                rating: 5,
                comment: "Professional, reliable, and incredibly talented. Would definitely work with them again.",
                date: "1 month ago",
              },
              {
                reviewer: "Emma Rodriguez",
                project: "The Journey Home",
                rating: 4,
                comment: "Great collaboration and excellent technical skills. Delivered exactly what we needed.",
                date: "2 months ago",
              },
            ].map((review, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {review.reviewer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.reviewer}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{review.project}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
