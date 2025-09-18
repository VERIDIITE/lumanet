import { type NextRequest, NextResponse } from "next/server"
import { mockProjects, type Project } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")

  try {
    let projects = [...mockProjects]

    // Filter by user if provided
    if (userId) {
      projects = projects.filter((project) => project.createdBy === userId)
    }

    // Filter by status if provided
    if (status) {
      projects = projects.filter((project) => project.status === status)
    }

    return NextResponse.json({ projects, success: true })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()

    // Generate new project ID
    const newId = (mockProjects.length + 1).toString()

    const newProject: Project = {
      id: newId,
      title: projectData.title,
      type: projectData.type,
      description: projectData.description,
      budget: projectData.budget,
      timeline: projectData.timeline,
      lookingFor: projectData.lookingFor || [],
      status: "recruiting",
      collaborators: 0,
      requests: 0,
      deadline: projectData.deadline,
      createdBy: projectData.userId || "user-1",
      createdAt: new Date().toISOString().split("T")[0],
    }

    // Add to mock database (in real app, this would be a database operation)
    mockProjects.push(newProject)

    return NextResponse.json({ project: newProject, success: true })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
