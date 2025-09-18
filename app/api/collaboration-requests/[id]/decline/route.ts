import { type NextRequest, NextResponse } from "next/server"
import { mockRequests, mockProjects } from "@/lib/mock-data"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requestId = params.id

    // Find the collaboration request
    const collaborationRequest = mockRequests.find((req) => req.id === requestId)

    if (!collaborationRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Update the request status to declined
    collaborationRequest.status = "declined"

    // Find the project and decrease requests count
    const project = mockProjects.find((p) => p.id === collaborationRequest.projectId)

    if (project) {
      // Decrease requests count
      project.requests = Math.max(0, project.requests - 1)
    }

    return NextResponse.json({
      success: true,
      message: "Collaboration request declined",
      request: collaborationRequest,
    })
  } catch (error) {
    console.error("Error declining collaboration request:", error)
    return NextResponse.json({ error: "Failed to decline request" }, { status: 500 })
  }
}
