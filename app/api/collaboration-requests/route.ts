import { type NextRequest, NextResponse } from "next/server"
import { mockRequests, mockCollaborators, mockProjects, type CollaborationRequest } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const collaboratorId = searchParams.get("collaboratorId")

  try {
    let requests = [...mockRequests]

    if (projectId) {
      requests = requests.filter((req) => req.projectId === projectId)
    }

    if (collaboratorId) {
      requests = requests.filter((req) => req.collaboratorId === collaboratorId)
    }

    const populatedRequests = requests.map((request) => {
      const collaborator = mockCollaborators.find((c) => c.id === request.collaboratorId)
      const project = mockProjects.find((p) => p.id === request.projectId)

      return {
        ...request,
        collaborator:
          request.collaborator ||
          (collaborator
            ? {
                id: collaborator.id,
                name: collaborator.name,
                role: collaborator.role,
                avatar: collaborator.avatar,
                rating: collaborator.rating,
              }
            : {
                id: "unknown",
                name: "Unknown Collaborator",
                role: "Unknown Role",
                avatar: "/placeholder.svg",
                rating: 0,
              }),
        project:
          request.project ||
          (project
            ? {
                id: project.id,
                title: project.title,
                type: project.type,
              }
            : {
                id: "unknown",
                title: "Unknown Project",
                type: "unknown",
              }),
      }
    })

    return NextResponse.json({ requests: populatedRequests, success: true })
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    const collaborator = mockCollaborators.find((c) => c.id === requestData.collaboratorId)
    const project = mockProjects.find((p) => p.id === requestData.projectId)

    const newRequest: CollaborationRequest = {
      id: (mockRequests.length + 1).toString(),
      projectId: requestData.projectId,
      collaboratorId: requestData.collaboratorId,
      message: requestData.message,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      collaborator: collaborator
        ? {
            id: collaborator.id,
            name: collaborator.name,
            role: collaborator.role,
            avatar: collaborator.avatar,
            rating: collaborator.rating,
          }
        : undefined,
      project: project
        ? {
            id: project.id,
            title: project.title,
            type: project.type,
          }
        : undefined,
      type: "received",
    }

    mockRequests.push(newRequest)

    return NextResponse.json({ request: newRequest, success: true })
  } catch (error) {
    console.error("Error creating collaboration request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
