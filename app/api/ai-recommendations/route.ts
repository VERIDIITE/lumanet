import { type NextRequest, NextResponse } from "next/server"
import { getAIRecommendedMatches } from "@/lib/ai-recommendations"
import { mockProjects } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const limit = Number.parseInt(searchParams.get("limit") || "6")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const project = mockProjects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const recommendations = await getAIRecommendedMatches(project, limit)

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        type: project.type,
      },
      recommendations,
      totalAnalyzed: 100, // Updated to reflect real tabb.cc data size
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI recommendations API error:", error)
    return NextResponse.json({ error: "Failed to generate AI recommendations" }, { status: 500 })
  }
}
