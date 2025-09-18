import { type NextRequest, NextResponse } from "next/server"
import { tabbProfiles } from "@/lib/processed-tabb-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collaboratorId = params.id

    // Find the collaborator in our processed data
    const baseProfile = tabbProfiles.find((profile) => profile.id === collaboratorId)

    if (!baseProfile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    // Create detailed profile data based on the base profile
    const detailedProfile = {
      id: baseProfile.id,
      name: baseProfile.name,
      role: baseProfile.role,
      location: baseProfile.location,
      bio: baseProfile.bio,
      avatar: baseProfile.avatar,
      rating: baseProfile.rating,
      availability: baseProfile.availability,
      skills: baseProfile.skills,
      experience: generateExperienceDescription(baseProfile),
      portfolio: generatePortfolio(baseProfile),
      testimonials: generateTestimonials(baseProfile),
      contact: {
        email: `${baseProfile.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        website: baseProfile.profileUrl,
      },
      stats: {
        projectsCompleted: baseProfile.portfolio,
        yearsExperience: getYearsFromExperience(baseProfile.experience),
        collaborators: Math.floor(baseProfile.portfolio * 2.5),
        awards: Math.floor(baseProfile.rating * 2),
      },
    }

    return NextResponse.json({
      success: true,
      profile: detailedProfile,
    })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ success: false, error: "Failed to load profile" }, { status: 500 })
  }
}

function generateExperienceDescription(profile: any): string {
  const experienceTemplates = {
    "Graduate Level": `As a recent graduate, ${profile.name} brings fresh perspectives and contemporary training to every project. Their academic foundation in ${profile.skills[0]} provides a solid base for creative exploration and professional growth.`,
    Emerging: `${profile.name} is an emerging talent in the industry, combining natural ability with dedicated practice. Their growing portfolio demonstrates versatility and commitment to craft excellence.`,
    Professional: `With professional experience across multiple projects, ${profile.name} has developed a refined approach to ${profile.skills[0]}. Their work consistently demonstrates technical proficiency and creative vision.`,
    "Expert Level": `${profile.name} is recognized as an expert in their field, with extensive experience and a proven track record of successful collaborations. Their expertise in ${profile.skills.slice(0, 2).join(" and ")} is highly sought after.`,
    "Senior Level": `As a senior professional, ${profile.name} brings years of industry experience and leadership to every project. Their mentorship and expertise have helped shape numerous successful productions.`,
  }

  return (
    experienceTemplates[profile.experience as keyof typeof experienceTemplates] || experienceTemplates["Professional"]
  )
}

function generatePortfolio(profile: any) {
  const portfolioItems = []
  const projectTypes = ["Short Film", "Feature Film", "Music Video", "Documentary", "Commercial", "Theatre Production"]

  for (let i = 0; i < Math.min(profile.portfolio, 8); i++) {
    const type = projectTypes[i % projectTypes.length]
    const year = 2024 - Math.floor(i / 2)

    portfolioItems.push({
      id: `p${i + 1}`,
      title: generateProjectTitle(profile, type, i),
      type,
      year: year.toString(),
      description: generateProjectDescription(profile, type),
      thumbnail: `/placeholder.svg?height=300&width=400&query=${type.toLowerCase().replace(" ", "-")}-${profile.role.toLowerCase().replace(" ", "-")}`,
      role: profile.role,
      awards: i < 2 ? [generateAward(type)] : undefined,
    })
  }

  return portfolioItems
}

function generateProjectTitle(profile: any, type: string, index: number): string {
  const titleTemplates = {
    "Short Film": ["Echoes", "The Last Light", "Midnight Stories", "Urban Dreams", "Silent Voices"],
    "Feature Film": ["Beyond Tomorrow", "The Journey Home", "Crossroads", "New Horizons", "The Final Act"],
    "Music Video": ["Neon Nights", "Electric Dreams", "City Lights", "Rhythm & Soul", "Beat of the Heart"],
    Documentary: ["Real Stories", "Hidden Truths", "Life Unscripted", "Behind the Scenes", "Authentic Voices"],
    Commercial: ["Brand Vision", "Creative Campaign", "Product Story", "Market Dreams", "Consumer Connect"],
    "Theatre Production": ["Stage Presence", "Live Performance", "Theatre Magic", "Dramatic Arts", "Stage Stories"],
  }

  const titles = titleTemplates[type as keyof typeof titleTemplates] || titleTemplates["Short Film"]
  return titles[index % titles.length]
}

function generateProjectDescription(profile: any, type: string): string {
  return `A compelling ${type.toLowerCase()} project showcasing ${profile.name}'s expertise in ${profile.skills[0]}. This work demonstrates their unique approach to storytelling and technical proficiency.`
}

function generateAward(type: string): string {
  const awards = {
    "Short Film": "Best Short Film - Independent Film Festival",
    "Feature Film": "Best Feature - Regional Film Awards",
    "Music Video": "Best Music Video - Creative Arts Awards",
    Documentary: "Best Documentary - Film Society Awards",
    Commercial: "Best Commercial - Advertising Excellence Awards",
    "Theatre Production": "Best Production - Theatre Arts Awards",
  }

  return awards[type as keyof typeof awards] || "Excellence in Creative Arts"
}

function generateTestimonials(profile: any) {
  return [
    {
      id: "t1",
      name: generateCollaboratorName(),
      role: generateCollaboratorRole(profile.role),
      company: generateCompanyName(),
      text: generateTestimonialText(profile),
      rating: Math.min(5, profile.rating + 0.2),
      avatar: `/placeholder.svg?height=50&width=50&query=professional-headshot`,
    },
  ]
}

function generateCollaboratorName(): string {
  const names = ["Alex Johnson", "Sarah Chen", "Marcus Thompson", "Emma Wilson", "David Rodriguez", "Lisa Park"]
  return names[Math.floor(Math.random() * names.length)]
}

function generateCollaboratorRole(profileRole: string): string {
  const roles = {
    Actor: "Director",
    Director: "Producer",
    Producer: "Director",
    "Singer Songwriter": "Music Producer",
    Screenwriter: "Director",
  }

  return roles[profileRole as keyof typeof roles] || "Creative Director"
}

function generateCompanyName(): string {
  const companies = [
    "Creative Studios",
    "Independent Films",
    "Bristol Productions",
    "Artisan Media",
    "Vision Entertainment",
  ]
  return companies[Math.floor(Math.random() * companies.length)]
}

function generateTestimonialText(profile: any): string {
  const templates = [
    `Working with ${profile.name} was an absolute pleasure. Their expertise in ${profile.skills[0]} brought our project to life in ways we never imagined.`,
    `${profile.name}'s professional approach and creative vision made all the difference. I would highly recommend them for any ${profile.role.toLowerCase()} role.`,
    `The quality of work ${profile.name} delivers is consistently outstanding. Their attention to detail and collaborative spirit make them a joy to work with.`,
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

function getYearsFromExperience(experience: string): number {
  const experienceYears = {
    "Graduate Level": 1,
    Emerging: 3,
    Professional: 7,
    "Expert Level": 12,
    "Senior Level": 15,
  }

  return experienceYears[experience as keyof typeof experienceYears] || 5
}
