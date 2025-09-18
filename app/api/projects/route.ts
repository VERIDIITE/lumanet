import { type NextRequest, NextResponse } from "next/server"
import {
  mockProjects,
  mockRequests,
  generateCollaborationRequests,
  generateInitialCollaborators,
  mockCollaborators,
  type Project,
} from "@/lib/mock-data"
import { generateAICollaborationRequests } from "@/lib/ai-collaboration-matcher"

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

    console.log("[v0] Generating AI-powered collaboration requests for project:", newProject.title)

    try {
      // Generate AI-powered collaboration requests using real tabb.cc profile data
      const aiGeneratedRequests = await generateAICollaborationRequests(
        newProject.title,
        newProject.description,
        newProject.lookingFor,
        mockCollaborators,
      )

      console.log("[v0] Generated", aiGeneratedRequests.length, "AI collaboration requests")

      // Add the AI-generated requests to the mock requests array
      aiGeneratedRequests.forEach((request) => {
        mockRequests.push(request)
      })

      // Update the project's request count
      newProject.requests = aiGeneratedRequests.length
    } catch (aiError) {
      console.error("[v0] AI generation failed, falling back to basic generation:", aiError)

      // Fallback to basic generation if AI fails
      const generatedRequests = generateCollaborationRequests(newProject, 4)
      generatedRequests.forEach((request) => {
        mockRequests.push(request)
      })
      newProject.requests = generatedRequests.length
    }

    // Generate initial collaborators (2 default collaborators)
    const initialCollaborators = generateInitialCollaborators(newProject, 2)
    newProject.collaborators = initialCollaborators.length

    console.log(
      "[v0] Project created with",
      newProject.requests,
      "requests and",
      newProject.collaborators,
      "collaborators",
    )

    return NextResponse.json({ project: newProject, success: true })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
