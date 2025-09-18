import { type NextRequest, NextResponse } from "next/server"
import { mockProjects } from "@/lib/mock-data"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; collaboratorId: string } },
) {
  try {
    const { projectId, collaboratorId } = params

    // Find the project
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    // Update the project's collaborator count
    const project = mockProjects[projectIndex]
    if (project.collaborators > 0) {
      mockProjects[projectIndex] = {
        ...project,
        collaborators: project.collaborators - 1,
      }
    }

    return NextResponse.json({
      success: true,
      message: "Collaborator removed successfully",
      project: mockProjects[projectIndex],
    })
  } catch (error) {
    console.error("Error removing collaborator:", error)
    return NextResponse.json({ success: false, error: "Failed to remove collaborator" }, { status: 500 })
  }
}
