import { type NextRequest, NextResponse } from "next/server"
import { mockRequests, type CollaborationRequest } from "@/lib/mock-data"

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

    return NextResponse.json({ requests, success: true })
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    const newRequest: CollaborationRequest = {
      id: (mockRequests.length + 1).toString(),
      projectId: requestData.projectId,
      collaboratorId: requestData.collaboratorId,
      message: requestData.message,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    }

    mockRequests.push(newRequest)

    return NextResponse.json({ request: newRequest, success: true })
  } catch (error) {
    console.error("Error creating collaboration request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
