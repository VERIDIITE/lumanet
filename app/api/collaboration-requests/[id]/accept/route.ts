import { type NextRequest, NextResponse } from "next/server"
import { mockRequests, mockProjects, mockCollaborators } from "@/lib/mock-data"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requestId = params.id

    // Find the collaboration request
    const collaborationRequest = mockRequests.find((req) => req.id === requestId)

    if (!collaborationRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Update the request status to accepted
    collaborationRequest.status = "accepted"

    // Find the project and add the collaborator to it
    const project = mockProjects.find((p) => p.id === collaborationRequest.projectId)
    const collaborator = mockCollaborators.find((c) => c.id === collaborationRequest.collaboratorId)

    if (project && collaborator) {
      // Increment collaborators count
      project.collaborators += 1
      // Decrease requests count
      project.requests = Math.max(0, project.requests - 1)
    }

    return NextResponse.json({
      success: true,
      message: "Collaboration request accepted successfully",
      request: collaborationRequest,
    })
  } catch (error) {
    console.error("Error accepting collaboration request:", error)
    return NextResponse.json({ error: "Failed to accept request" }, { status: 500 })
  }
}
