import { type NextRequest, NextResponse } from "next/server"
import { mockCollaborators, getRecommendedCollaborators, mockProjects } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const projectType = searchParams.get("projectType")
  const projectId = searchParams.get("projectId")
  const limit = Number.parseInt(searchParams.get("limit") || "6")

  try {
    let collaborators = [...mockCollaborators]

    // If projectId is provided, get AI recommendations for that project
    if (projectId) {
      const project = mockProjects.find((p) => p.id === projectId)
      if (project) {
        collaborators = getRecommendedCollaborators(project, limit)
        return NextResponse.json({ collaborators, success: true })
      }
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      collaborators = collaborators.filter(
        (collaborator) =>
          collaborator.name.toLowerCase().includes(searchLower) ||
          collaborator.role.toLowerCase().includes(searchLower) ||
          collaborator.location.toLowerCase().includes(searchLower) ||
          collaborator.skills.some((skill) => skill.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by project type
    if (projectType && projectType !== "both") {
      collaborators = collaborators.filter((collaborator) => {
        if (projectType === "film") {
          return collaborator.skills.some((skill) =>
            ["Director", "Producer", "DoP", "Cinematographer", "Editor"].includes(skill),
          )
        } else if (projectType === "music") {
          return collaborator.skills.some((skill) =>
            ["Producer", "Sound Engineer", "Composer", "Audio Engineer"].includes(skill),
          )
        }
        return true
      })
    }

    // Limit results
    collaborators = collaborators.slice(0, limit)

    return NextResponse.json({ collaborators, success: true })
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json({ error: "Failed to fetch collaborators" }, { status: 500 })
  }
}
