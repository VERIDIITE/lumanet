"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CollaboratorProfile } from "@/components/collaborator-profile"
import { mockCollaborators, type Collaborator } from "@/lib/mock-data"

export default function CollaboratorPage() {
  const params = useParams()
  const router = useRouter()
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null)

  useEffect(() => {
    const id = params.id as string
    const found = mockCollaborators.find((c) => c.id === id)
    setCollaborator(found || null)
  }, [params.id])

  const handleConnect = async (collaboratorId: string, message: string) => {
    try {
      const response = await fetch("/api/collaboration-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: "1", // Default project for demo
          collaboratorId,
          message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Connection request sent successfully!")
      }
    } catch (error) {
      console.error("Failed to send connection request:", error)
      alert("Failed to send connection request")
    }
  }

  if (!collaborator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Collaborator Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <CollaboratorProfile collaborator={collaborator} onConnect={handleConnect} />
      </div>
    </div>
  )
}
