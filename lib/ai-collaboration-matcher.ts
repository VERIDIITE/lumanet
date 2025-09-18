import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function generateAICollaborationRequests(
  projectTitle: string,
  projectDescription: string,
  requiredRoles: string[],
  tabbProfiles: any[],
) {
  try {
    console.log(
      "[v0] Generating AI-powered collaboration requests with portfolio extraction for project:",
      projectTitle,
    )

    // Enhanced profile summaries with portfolio extraction
    const enhancedProfileSummaries = tabbProfiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      role: profile.role,
      location: profile.location,
      skills: profile.skills,
      experience_level: profile.experience_level,
      portfolio_size: profile.portfolio_size,
      availability: profile.availability,
      bio: profile.bio?.substring(0, 300),
      // Raw tabb.cc data for AI processing
      raw_profile_about: profile.raw_data?.profile_about,
      raw_roles: [
        profile.raw_data?.roleslist_link,
        profile.raw_data?.roleslist,
        profile.raw_data?.roleslist_link1,
        profile.raw_data?.roleslist4,
      ].filter(Boolean),
      tabb_url: profile.raw_data?.Title_URL,
      image_url: profile.raw_data?.Image,
    }))

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are an AI collaboration matching system. Analyze the project and collaborators, then return ONLY valid JSON.

PROJECT: ${projectTitle}
DESCRIPTION: ${projectDescription}
REQUIRED ROLES: ${requiredRoles.join(", ")}

COLLABORATORS:
${JSON.stringify(enhancedProfileSummaries.slice(0, 8), null, 2)}

Create detailed portfolios and match 4 collaborators. Return ONLY this JSON structure with no additional text:

{
  "matches": [
    {
      "collaboratorId": "string",
      "message": "personalized message referencing their work",
      "skills": ["skill1", "skill2"],
      "availability": "available",
      "interest_level": 8,
      "estimated_hours": 25,
      "enhanced_portfolio": {
        "projects": [
          {
            "title": "Project Name",
            "description": "Brief description",
            "year": 2023,
            "category": "Feature Film",
            "role": "Director",
            "status": "Completed"
          }
        ],
        "specialties": ["specialty1", "specialty2"],
        "equipment": ["equipment1", "equipment2"],
        "notable_collaborations": ["Company Name"],
        "years_experience": 5,
        "education": "Training Background"
      }
    }
  ],
  "reasoning": "Why these collaborators were selected"
}`,
      maxOutputTokens: 3000,
    })

    let parsedResponse
    try {
      // Extract JSON from response text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : text.trim()

      console.log("[v0] Raw AI response length:", text.length)
      console.log("[v0] Extracted JSON length:", jsonText.length)

      parsedResponse = JSON.parse(jsonText)

      // Validate the response structure
      if (!parsedResponse.matches || !Array.isArray(parsedResponse.matches)) {
        throw new Error("Invalid response structure")
      }
    } catch (parseError) {
      console.log("[v0] Failed to parse AI response, using enhanced fallback")
      console.log("[v0] Raw response:", text.substring(0, 200) + "...")
      return generateEnhancedFallbackRequests(projectTitle, projectDescription, tabbProfiles)
    }

    console.log(
      "[v0] Generated",
      parsedResponse.matches?.length || 0,
      "AI collaboration requests with enhanced portfolios",
    )

    return (
      parsedResponse.matches?.map((match: any) => {
        const collaborator = tabbProfiles.find((p) => p.id === match.collaboratorId)
        return {
          id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          collaboratorId: match.collaboratorId,
          collaborator: collaborator || {
            id: match.collaboratorId,
            name: "AI Generated",
            role: "Creative Professional",
            location: "Global",
            avatar: "/professional-avatar.png",
          },
          projectId: `project_${Date.now()}`,
          project: {
            title: projectTitle,
            description: projectDescription,
          },
          message: match.message,
          status: "pending" as const,
          createdAt: new Date().toISOString(),
          skills: match.skills || [],
          availability: match.availability || "available",
          interestLevel: match.interest_level || 8,
          estimatedHours: match.estimated_hours || 20,
          // Enhanced portfolio data
          enhancedPortfolio: match.enhanced_portfolio || generateFallbackPortfolio(collaborator),
        }
      }) || generateEnhancedFallbackRequests(projectTitle, projectDescription, tabbProfiles)
    )
  } catch (error) {
    console.error("AI collaboration matching failed:", error)
    return generateEnhancedFallbackRequests(projectTitle, projectDescription, tabbProfiles)
  }
}

export async function generateAICollaboratorMessage(collaboratorProfile: any, projectDetails: any) {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `
        Generate a personalized collaboration request message from ${collaboratorProfile.name} to a project creator.
        
        COLLABORATOR PROFILE:
        Name: ${collaboratorProfile.name}
        Role: ${collaboratorProfile.role}
        Location: ${collaboratorProfile.location}
        Skills: ${collaboratorProfile.skills?.join(", ")}
        Experience: ${collaboratorProfile.experience_level}
        Bio: ${collaboratorProfile.bio}
        
        PROJECT DETAILS:
        Title: ${projectDetails.title}
        Description: ${projectDetails.description}
        
        Write a 2-3 sentence message where the collaborator:
        1. Shows genuine interest in the specific project
        2. Mentions relevant skills or experience they bring
        3. Sounds professional but friendly
        4. References something specific about the project or their background
        
        Keep it concise and authentic.
      `,
      maxOutputTokens: 200,
    })

    return text
  } catch (error) {
    console.error("AI message generation failed:", error)
    return `Hi! I'm ${collaboratorProfile.name}, a ${collaboratorProfile.role} with experience in ${collaboratorProfile.skills?.[0] || "creative projects"}. Your project "${projectDetails.title}" caught my attention and I'd love to collaborate. I think my skills would be a great fit for what you're building.`
  }
}

function generateEnhancedFallbackRequests(projectTitle: string, projectDescription: string, tabbProfiles: any[]) {
  return tabbProfiles.slice(0, 4).map((collaborator, index) => ({
    id: `req_${Date.now()}_${index}`,
    collaboratorId: collaborator.id,
    collaborator,
    projectId: `project_${Date.now()}`,
    project: {
      title: projectTitle,
      description: projectDescription,
    },
    message: `Hi! I'm ${collaborator.name}, a ${collaborator.role} interested in collaborating on "${projectTitle}". I believe my skills in ${collaborator.skills?.[0] || "creative work"} would be valuable for this project.`,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    skills: collaborator.skills || [],
    availability: collaborator.availability || "available",
    interestLevel: Math.floor(Math.random() * 3) + 7,
    estimatedHours: Math.floor(Math.random() * 20) + 10,
    enhancedPortfolio: generateFallbackPortfolio(collaborator),
  }))
}

function generateFallbackPortfolio(collaborator: any) {
  const projectTypes = {
    Director: ["Feature Film", "Short Film", "Documentary", "Music Video"],
    Actor: ["Feature Film", "Short Film", "Theatre", "Commercial"],
    Cinematographer: ["Feature Film", "Documentary", "Music Video", "Commercial"],
    Writer: ["Feature Film", "Short Film", "Theatre", "Web Series"],
    Producer: ["Feature Film", "Documentary", "Short Film", "Commercial"],
    Musician: ["Music Video", "Film Score", "Album", "Live Performance"],
    Editor: ["Feature Film", "Documentary", "Music Video", "Commercial"],
  }

  const role = collaborator?.role || "Creative Professional"
  const types = projectTypes[role] || ["Short Film", "Commercial", "Music Video"]

  const projects = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, i) => ({
    title: `${role} Project ${i + 1}`,
    description: `Professional ${types[i % types.length].toLowerCase()} showcasing ${collaborator?.skills?.[0] || "creative"} expertise`,
    year: 2024 - Math.floor(Math.random() * 3),
    category: types[i % types.length],
    role: role,
    status: i === 0 ? "In Progress" : "Completed",
  }))

  return {
    projects,
    specialties: collaborator?.skills?.slice(0, 3) || ["Creative Direction"],
    equipment: ["Professional Equipment", "Industry Standard Tools"],
    notable_collaborations: ["Independent Productions", "Local Film Community"],
    years_experience: Math.floor(Math.random() * 8) + 2,
    education: "Professional Training",
  }
}
