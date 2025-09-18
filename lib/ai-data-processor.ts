import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

// Schema for processed collaborator data
const CollaboratorSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  location: z.string(),
  bio: z.string(),
  skills: z.array(z.string()),
  rating: z.number().min(3.5).max(5.0),
  matchScore: z.number().min(60).max(100),
  avatar: z.string(),
  availability: z.enum(["available", "busy", "unavailable"]),
  experience: z.string(),
  portfolio: z.number().min(1).max(50),
  profileUrl: z.string(),
})

const ProcessedDataSchema = z.object({
  collaborators: z.array(CollaboratorSchema).length(100),
})

export async function processRawProfilesWithAI(rawProfiles: any[]): Promise<any[]> {
  try {
    console.log("[v0] Processing", rawProfiles.length, "raw profiles with AI...")

    // Take first 120 profiles to ensure we get 100 good ones after AI processing
    const selectedProfiles = rawProfiles.slice(0, 120)

    const { object } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: ProcessedDataSchema,
      prompt: `
        You are an AI data processor for a film and media collaboration platform. 
        Process these raw tabb.cc profile data into exactly 100 clean, structured collaborator profiles.

        Raw data: ${JSON.stringify(selectedProfiles, null, 2)}

        Instructions:
        1. Extract and clean the data from each profile
        2. Convert "Title" to "name" 
        3. Extract primary role from roleslist_link, roleslist, roleslist_link1, roleslist4 fields
        4. Clean and format "Location" (remove country, keep city)
        5. Use "profile_about" as bio (if empty, create a brief professional bio based on role)
        6. Extract skills from all role fields and create a skills array (3-6 skills per person)
        7. Generate realistic ratings between 3.5-5.0
        8. Generate match scores between 60-100
        9. Use "Image" URL as avatar
        10. Assign realistic availability status
        11. Generate experience level based on bio/role complexity
        12. Generate portfolio count (1-50 projects)
        13. Use "Title_URL" as profileUrl
        14. Create unique IDs using name-based slugs

        Make the data realistic and diverse. Ensure exactly 100 profiles.
        Focus on film, TV, music, and media industry roles.
      `,
    })

    console.log("[v0] Successfully processed", object.collaborators.length, "profiles")
    return object.collaborators
  } catch (error) {
    console.error("[v0] Error processing profiles with AI:", error)
    throw error
  }
}
