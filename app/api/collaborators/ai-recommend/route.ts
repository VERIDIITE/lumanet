import { type NextRequest, NextResponse } from "next/server"
import { collaborators } from "@/lib/mock-data"

// AI-powered collaborator recommendation algorithm
function calculateProjectMatch(collaborator: any, projectData: any): number {
  let score = 0
  const maxScore = 100

  // Skills matching (40% weight)
  const skillsWeight = 40
  const requiredRoles = projectData.lookingFor || []
  const collaboratorSkills = collaborator.skills || []

  let skillMatches = 0
  requiredRoles.forEach((role: string) => {
    if (
      collaboratorSkills.some(
        (skill: string) =>
          skill.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(skill.toLowerCase()),
      )
    ) {
      skillMatches++
    }
  })

  if (requiredRoles.length > 0) {
    score += (skillMatches / requiredRoles.length) * skillsWeight
  }

  // Project type compatibility (25% weight)
  const typeWeight = 25
  const projectType = projectData.projectType || ""
  const collaboratorExperience = collaborator.experience || []

  let typeMatch = 0
  if (projectType.includes("film") && collaborator.role.toLowerCase().includes("film")) {
    typeMatch = 1
  } else if (projectType.includes("music") && collaborator.role.toLowerCase().includes("music")) {
    typeMatch = 1
  } else if (
    collaborator.role.toLowerCase().includes("director") ||
    collaborator.role.toLowerCase().includes("producer") ||
    collaborator.role.toLowerCase().includes("cinematographer")
  ) {
    typeMatch = 0.8 // General film roles
  }

  score += typeMatch * typeWeight

  // Availability (20% weight)
  const availabilityWeight = 20
  if (collaborator.availability === "available") {
    score += availabilityWeight
  } else if (collaborator.availability === "busy") {
    score += availabilityWeight * 0.5
  }

  // Rating and experience (15% weight)
  const qualityWeight = 15
  const rating = collaborator.rating || 0
  score += (rating / 5) * qualityWeight

  // Add some randomization for variety (±5 points)
  score += (Math.random() - 0.5) * 10

  return Math.min(Math.max(Math.round(score), 0), maxScore)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, projectType, lookingFor, description, budget, timeline } = body

    // Calculate match scores for all collaborators
    const collaboratorsWithScores = collaborators.map((collaborator) => ({
      ...collaborator,
      matchScore: calculateProjectMatch(collaborator, {
        projectType,
        lookingFor,
        description,
        budget,
        timeline,
      }),
    }))

    // Sort by match score and get top recommendations
    const recommendedCollaborators = collaboratorsWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter((c) => c.matchScore > 60) // Only recommend high-quality matches
      .slice(0, 6) // Top 6 recommendations

    return NextResponse.json({
      success: true,
      recommendedCollaborators,
      projectId,
      totalMatches: recommendedCollaborators.length,
    })
  } catch (error) {
    console.error("AI recommendation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate AI recommendations" }, { status: 500 })
  }
}
