import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import fs from "fs"

interface RawTabbProfile {
  Title: string
  Title_URL: string
  Image: string
  Location: string
  profile_about: string
  roleslist_link: string
  roleslist: string
  roleslist_link1: string
  roleslist4: string
  fullprofilelink: string
  talent_URL: string
  talent_URL2: string
  Avg_price: string
}

interface ProcessedProfile {
  id: string
  name: string
  profileUrl: string
  image: string
  location: string
  bio: string
  role: string
  roles: string[]
  specialties: string[]
  experience: string
  availability: "available" | "busy" | "unavailable"
  contactUrl: string
  skills: string[]
  portfolio: number
  rating: number
  avatar: string
  matchScore: number
}

async function processProfiles() {
  console.log("[v0] Loading raw tabb.cc profiles...")

  // Load the raw data
  const rawData = JSON.parse(fs.readFileSync("data/raw-tabb-profiles.json", "utf8")) as RawTabbProfile[]

  // Filter out empty profiles
  const validProfiles = rawData
    .filter(
      (profile) => profile.Title && profile.Title.trim() !== "" && profile.Location && profile.Location.trim() !== "",
    )
    .slice(0, 150) // Take first 150 valid profiles for AI to select from

  console.log(`[v0] Found ${validProfiles.length} valid profiles to process`)

  // Use AI to intelligently select and process the best 100 profiles
  const { object: processedData } = await generateObject({
    model: groq("llama-3.1-70b-versatile"),
    schema: {
      type: "object",
      properties: {
        selectedProfiles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              profileUrl: { type: "string" },
              image: { type: "string" },
              location: { type: "string" },
              bio: { type: "string" },
              role: { type: "string" },
              roles: { type: "array", items: { type: "string" } },
              specialties: { type: "array", items: { type: "string" } },
              experience: { type: "string" },
              availability: { type: "string" },
              contactUrl: { type: "string" },
              skills: { type: "array", items: { type: "string" } },
              portfolioSize: { type: "number" },
              rating: { type: "number" },
              avatar: { type: "string" },
            },
            required: [
              "id",
              "name",
              "profileUrl",
              "image",
              "location",
              "bio",
              "role",
              "roles",
              "specialties",
              "experience",
              "availability",
              "contactUrl",
              "skills",
              "portfolioSize",
              "rating",
              "avatar",
            ],
          },
        },
      },
      required: ["selectedProfiles"],
    },
    prompt: `You are an AI data processor for a film industry collaboration platform. 

Process these ${validProfiles.length} real tabb.cc profiles and select the BEST 100 profiles for a collaboration platform.

SELECTION CRITERIA:
- Prioritize profiles with detailed bios and clear role descriptions
- Include diverse roles: Directors, Producers, Writers, Actors, Cinematographers, Editors, Sound Engineers, etc.
- Ensure geographic diversity across UK locations
- Select profiles that show professional experience and skills

FOR EACH SELECTED PROFILE, TRANSFORM THE DATA:

1. CREATE UNIQUE ID: Generate a unique slug-style ID from the name (e.g., "jordan-hare")
2. EXTRACT PRIMARY ROLE: Create a concise primary role description (e.g., "Director & Producer", "Actor", "Cinematographer")
3. EXTRACT ALL ROLES: Parse all role information from roleslist_link, roleslist, roleslist_link1, roleslist4 into roles array
4. INFER SPECIALTIES: Based on bio and roles, determine 2-4 specialties (e.g., "Independent Films", "Documentary", "Commercial", "Theatre", "Music Videos")
5. DETERMINE EXPERIENCE: Based on bio content, classify as "Entry Level", "Mid Level", "Senior Level", or "Expert Level"
6. SET AVAILABILITY: Randomly assign "available", "busy", or "unavailable"
7. EXTRACT SKILLS: From bio and roles, identify 3-6 relevant skills
8. ESTIMATE PORTFOLIO: Based on experience and bio, assign portfolio size (5-50 projects)
9. ASSIGN RATING: Random rating between 4.2-4.9
10. CREATE AVATAR: Generate a descriptive avatar filename based on their role and characteristics

CLEAN AND ENHANCE DATA:
- Clean up bio text, remove extra whitespace and formatting issues
- Standardize location format (CITY, COUNTRY)
- Ensure all URLs are properly formatted
- Make bios more professional if needed
- Use the existing image URL if available, otherwise create descriptive avatar filename

Raw profiles to process:
${JSON.stringify(validProfiles, null, 2)}`,
  })

  console.log(`[v0] AI processed and selected ${processedData.selectedProfiles.length} profiles`)

  // Save the processed data in the format expected by the existing system
  const outputPath = "lib/processed-tabb-data.ts"
  const fileContent = `// Auto-generated from real tabb.cc data using AI processing
// Generated on ${new Date().toISOString()}

export interface TabbProfile {
  id: string
  name: string
  role: string
  profileUrl: string
  image: string
  location: string
  bio: string
  roles: string[]
  specialties: string[]
  experience: string
  availability: "available" | "busy" | "unavailable"
  contactUrl: string
  skills: string[]
  portfolio: number
  rating: number
  avatar: string
  matchScore: number
}

export const tabbProfiles: TabbProfile[] = ${JSON.stringify(
    processedData.selectedProfiles.map((profile: any) => ({
      ...profile,
      portfolio: profile.portfolioSize,
      availability: profile.availability as "available" | "busy" | "unavailable",
      matchScore: 0, // Will be calculated dynamically
    })),
    null,
    2,
  )}

export const getProfileById = (id: string): TabbProfile | undefined => {
  return tabbProfiles.find(profile => profile.id === id)
}

export const getProfilesByRole = (role: string): TabbProfile[] => {
  return tabbProfiles.filter(profile => 
    profile.roles.some(r => r.toLowerCase().includes(role.toLowerCase()))
  )
}

export const getProfilesByLocation = (location: string): TabbProfile[] => {
  return tabbProfiles.filter(profile => 
    profile.location.toLowerCase().includes(location.toLowerCase())
  )
}

export const getAvailableProfiles = (): TabbProfile[] => {
  return tabbProfiles.filter(profile => profile.availability === 'available')
}
`

  fs.writeFileSync(outputPath, fileContent)
  console.log(`[v0] Saved processed profiles to ${outputPath}`)
  console.log(`[v0] Successfully processed ${processedData.selectedProfiles.length} real tabb.cc profiles!`)
}

processProfiles().catch(console.error)
