import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { tabbProfiles } from "./processed-tabb-data"
import type { Collaborator, Project } from "./mock-data"
import { z } from "zod"

const RecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      collaboratorId: z.string(),
      matchScore: z.number().min(0).max(100),
      reasoning: z.string(),
      keyStrengths: z.array(z.string()),
      potentialConcerns: z.array(z.string()).optional(),
      recommendationLevel: z.enum(["highly_recommended", "recommended", "good_fit", "potential_fit"]),
    }),
  ),
})

export async function getAIRecommendedMatches(
  project: Project,
  limit = 6,
): Promise<
  {
    collaboratorId: string
    matchScore: number
    reasoning: string
    keyStrengths: string[]
    potentialConcerns?: string[]
    recommendationLevel: "highly_recommended" | "recommended" | "good_fit" | "potential_fit"
    collaborator: Collaborator
  }[]
> {
  try {
    const { object } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: RecommendationSchema,
      prompt: `You are an expert film industry talent matcher. Analyze the following project and recommend the best collaborators from the available profiles.

PROJECT DETAILS:
Title: ${project.title}
Type: ${project.type}
Description: ${project.description}
Budget: ${project.budget}
Timeline: ${project.timeline}
Looking for: ${project.lookingFor.join(", ")}
Status: ${project.status}

AVAILABLE COLLABORATORS:
${tabbProfiles
  .map(
    (c) => `
ID: ${c.id}
Name: ${c.name}
Role: ${c.role}
Location: ${c.location}
Bio: ${c.bio}
Skills: ${c.skills.join(", ")}
Rating: ${c.rating}/5
Experience: ${c.experience}
Portfolio: ${c.portfolio} projects
Availability: ${c.availability}
`,
  )
  .join("\n")}

Please analyze each collaborator and provide the top ${limit} recommendations. Consider:
1. Skill alignment with project needs
2. Experience level and portfolio size
3. Geographic location and availability
4. Creative fit based on bio and specializations
5. Budget compatibility (professional vs emerging talent)
6. Timeline feasibility

For each recommendation, provide:
- Match score (0-100)
- Clear reasoning for the recommendation
- Key strengths that make them suitable
- Any potential concerns (optional)
- Recommendation level (highly_recommended, recommended, good_fit, potential_fit)

Focus on finding the most suitable matches, not just the highest-rated collaborators.`,
    })

    const recommendations = object.recommendations
      .map((rec) => {
        const collaborator = tabbProfiles.find((c) => c.id === rec.collaboratorId)
        if (!collaborator) return null

        return {
          ...rec,
          collaborator: {
            ...collaborator,
            matchScore: rec.matchScore,
          },
        }
      })
      .filter(Boolean)
      .slice(0, limit)

    return recommendations as any[]
  } catch (error) {
    console.error("AI recommendation error:", error)

    return tabbProfiles
      .map((collaborator) => ({
        collaboratorId: collaborator.id,
        matchScore: calculateBasicMatchScore(project, collaborator),
        reasoning: `Good match based on skills in ${collaborator.skills.slice(0, 2).join(" and ")} and ${collaborator.experience.toLowerCase()} experience level.`,
        keyStrengths: collaborator.skills.slice(0, 3),
        recommendationLevel: "good_fit" as const,
        collaborator: {
          ...collaborator,
          matchScore: calculateBasicMatchScore(project, collaborator),
        },
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
  }
}

function calculateBasicMatchScore(project: Project, collaborator: Collaborator): number {
  let score = 70

  const matchingSkills = collaborator.skills.filter((skill) =>
    project.lookingFor.some(
      (needed) =>
        needed.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(needed.toLowerCase()),
    ),
  )

  score += matchingSkills.length * 10
  if (collaborator.availability === "available") score += 10
  if (collaborator.experience === "Professional") score += 5
  score += Math.min(collaborator.portfolio, 10)
  score += (collaborator.rating - 4) * 10

  return Math.min(score, 100)
}
