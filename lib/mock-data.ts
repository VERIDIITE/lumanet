import { tabbProfiles } from "./processed-tabb-data"

// Mock database using real profiles from tabb.cc/profiles
export interface Collaborator {
  id: string
  name: string
  role: string
  location: string
  bio: string
  skills: string[]
  rating: number
  matchScore: number
  avatar: string
  availability: "available" | "busy" | "unavailable"
  experience: string
  portfolio: number
  profileUrl?: string
}

export interface Project {
  id: string
  title: string
  type: "short-film" | "feature-film" | "music-video" | "documentary" | "commercial"
  description: string
  budget: string
  timeline: string
  lookingFor: string[]
  status: "active" | "recruiting" | "completed"
  collaborators: number
  requests: number
  deadline: string
  createdBy: string
  createdAt: string
}

export interface CollaborationRequest {
  id: string
  projectId: string
  collaboratorId: string
  message: string
  status: "pending" | "accepted" | "declined"
  createdAt: string
  collaborator?: {
    id: string
    name: string
    role: string
    avatar: string
    rating: number
  }
  project?: {
    id: string
    title: string
    type: string
  }
  type?: "sent" | "received"
}

export const mockCollaborators: Collaborator[] = tabbProfiles.map((profile) => ({
  id: profile.id,
  name: profile.name,
  role: profile.role,
  location: profile.location,
  bio: profile.bio,
  skills: profile.skills,
  rating: profile.rating,
  matchScore: profile.matchScore,
  avatar: profile.avatar,
  availability: profile.availability,
  experience: profile.experience,
  portfolio: profile.portfolio,
  profileUrl: profile.profileUrl,
}))

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Neon Dreams: A Cyberpunk Music Video",
    type: "music-video",
    description:
      "An immersive cyberpunk music video featuring neon-soaked cityscapes, holographic dancers, and cutting-edge visual effects. We're creating a futuristic world where technology and humanity collide in stunning visual harmony.",
    budget: "10k+",
    timeline: "3-4-months",
    lookingFor: ["VFX Artist", "Cinematographer", "Choreographer", "Lighting Designer"],
    status: "recruiting",
    collaborators: 2,
    requests: 1,
    deadline: "2024-04-15",
    createdBy: "user-1",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    title: "The Last Library: Sci-Fi Short Film",
    type: "short-film",
    description:
      "In a post-apocalyptic world where books are banned, a young librarian discovers the last remaining library hidden beneath the ruins of civilization. A story about preserving knowledge and hope in the darkest times.",
    budget: "5k-10k",
    timeline: "4-5-months",
    lookingFor: ["Production Designer", "Sound Designer", "Editor", "Costume Designer"],
    status: "recruiting",
    collaborators: 3,
    requests: 1,
    deadline: "2024-05-30",
    createdBy: "user-2",
    createdAt: "2024-01-22",
  },
  {
    id: "3",
    title: "Indie Horror Short",
    type: "short-film",
    description: "A psychological horror short exploring themes of isolation and paranoia in a remote cabin setting.",
    budget: "1k-5k",
    timeline: "2-3-months",
    lookingFor: ["Cinematographer", "Sound Engineer", "Editor"],
    status: "active",
    collaborators: 3,
    requests: 12,
    deadline: "2024-02-15",
    createdBy: "user-1",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Sci-Fi Short Film",
    type: "short-film",
    description: "A thought-provoking sci-fi short about AI consciousness, perfect for festival submissions.",
    budget: "5k-10k",
    timeline: "3-4-months",
    lookingFor: ["DoP", "VFX Artist", "Sound Designer"],
    status: "active",
    collaborators: 2,
    requests: 18,
    deadline: "2024-04-01",
    createdBy: "user-3",
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    title: "Commercial Campaign",
    type: "commercial",
    description: "Series of commercials for a sustainable fashion brand, focusing on authentic storytelling.",
    budget: "10k+",
    timeline: "2-months",
    lookingFor: ["Director", "Producer", "Cinematographer"],
    status: "recruiting",
    collaborators: 1,
    requests: 22,
    deadline: "2024-03-15",
    createdBy: "user-4",
    createdAt: "2024-01-12",
  },
  {
    id: "6",
    title: "Theatre Documentary",
    type: "documentary",
    description: "Behind-the-scenes documentary following a local theatre company's production process.",
    budget: "1k-5k",
    timeline: "4-months",
    lookingFor: ["Videographer", "Editor", "Sound Recordist"],
    status: "active",
    collaborators: 1,
    requests: 9,
    deadline: "2024-05-01",
    createdBy: "user-5",
    createdAt: "2024-01-18",
  },
]

export const mockRequests: CollaborationRequest[] = [
  {
    id: "1",
    projectId: "1",
    collaboratorId: "6",
    message:
      "This cyberpunk music video concept is absolutely incredible! As a director with 15+ years of experience in music videos and commercials, I'm passionate about creating imaginative visuals using narrative and light. The neon-soaked aesthetic and holographic elements align perfectly with my visual storytelling approach. I'd love to bring this futuristic vision to life with cutting-edge cinematography techniques.",
    status: "pending",
    createdAt: "2024-01-21",
    collaborator: {
      id: "6",
      name: "Bashart Malik",
      role: "Director & DOP",
      avatar: "/experienced-male-director-and-cinematographer-with.jpg",
      rating: 4.9,
    },
    project: {
      id: "1",
      title: "Neon Dreams: A Cyberpunk Music Video",
      type: "music-video",
    },
    type: "received",
  },
  {
    id: "2",
    projectId: "2",
    collaboratorId: "4",
    message:
      "The Last Library sounds like an amazing sci-fi project! As a non-binary DOP & Gaffer who's especially interested in sci-fi stories, this post-apocalyptic narrative about preserving knowledge really resonates with me. I'm owner-operator with C70 & BMPCC6k Pro, and I'd love to create the atmospheric lighting that brings this underground library world to life. The themes of hope and knowledge preservation are exactly the kind of meaningful stories I want to help tell.",
    status: "pending",
    createdAt: "2024-01-23",
    collaborator: {
      id: "4",
      name: "Lux Goldman",
      role: "DoP & Gaffer",
      avatar: "/non-binary-cinematographer-and-gaffer-specializing.jpg",
      rating: 4.6,
    },
    project: {
      id: "2",
      title: "The Last Library: Sci-Fi Short Film",
      type: "short-film",
    },
    type: "received",
  },
  {
    id: "3",
    projectId: "3",
    collaboratorId: "3",
    message:
      "I'd love to work on this horror project. My experience with atmospheric cinematography and sound design would be perfect for creating the eerie mood you're looking for.",
    status: "pending",
    createdAt: "2024-01-12",
    collaborator: {
      id: "3",
      name: "Sean Bailey",
      role: "Director & Writer",
      avatar: "/independent-male-film-director-trained-at-royal-ce.jpg",
      rating: 4.7,
    },
    project: {
      id: "3",
      title: "Indie Horror Short",
      type: "short-film",
    },
    type: "received",
  },
  {
    id: "4",
    projectId: "4",
    collaboratorId: "7",
    message:
      "This sci-fi concept aligns perfectly with my horror background. I'd love to explore the psychological aspects of AI consciousness.",
    status: "pending",
    createdAt: "2024-01-18",
    collaborator: {
      id: "7",
      name: "Oliver Park",
      role: "Horror Director & Writer",
      avatar: "/male-horror-film-director-specializing-in-innovati.jpg",
      rating: 4.5,
    },
    project: {
      id: "4",
      title: "Sci-Fi Short Film",
      type: "short-film",
    },
    type: "received",
  },
  {
    id: "5",
    projectId: "5",
    collaboratorId: "2",
    message:
      "I'm passionate about sustainable fashion and authentic storytelling. This commercial campaign sounds like a perfect fit for my skills.",
    status: "pending",
    createdAt: "2024-01-20",
    collaborator: {
      id: "2",
      name: "Shannon R. Hammond",
      role: "Producer",
      avatar: "/professional-female-producer-with-keen-eye-for-det.jpg",
      rating: 4.9,
    },
    project: {
      id: "5",
      title: "Commercial Campaign",
      type: "commercial",
    },
    type: "received",
  },
]

// AI matching algorithm simulation
export function calculateMatchScore(project: Project, collaborator: Collaborator): number {
  let score = 70 // Base score

  // Check if collaborator skills match what project is looking for
  const matchingSkills = collaborator.skills.filter((skill) =>
    project.lookingFor.some(
      (needed) =>
        needed.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(needed.toLowerCase()),
    ),
  )

  score += matchingSkills.length * 10

  // Bonus for availability
  if (collaborator.availability === "available") score += 10

  // Bonus for experience level
  if (
    collaborator.experience === "Professional" ||
    collaborator.experience === "Expert Level" ||
    collaborator.experience === "Senior Level"
  )
    score += 5

  // Bonus for portfolio size
  score += Math.min(collaborator.portfolio, 10)

  // Bonus for high rating
  score += (collaborator.rating - 4) * 10

  return Math.min(score, 100)
}

export function getRecommendedCollaborators(project: Project, limit = 6): Collaborator[] {
  return mockCollaborators
    .map((collaborator) => ({
      ...collaborator,
      matchScore: calculateMatchScore(project, collaborator),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

// AI-powered request generation function
export function generateCollaborationRequests(project: Project, count = 4): CollaborationRequest[] {
  const availableCollaborators = mockCollaborators.filter((c) => c.availability === "available")
  const matchedCollaborators = getRecommendedCollaborators(project, count)

  const generatePersonalizedMessage = (collaborator: Collaborator, project: Project): string => {
    const messages = [
      `Hi! I'm ${collaborator.name}, a ${collaborator.role} based in ${collaborator.location}. Your project "${project.title}" really caught my attention! With my ${collaborator.experience.toLowerCase()} experience in ${collaborator.skills.slice(0, 2).join(" and ")}, I believe I could bring valuable expertise to this ${project.type.replace("-", " ")}. I'd love to discuss how we can collaborate to bring your vision to life.`,

      `Hello! As a ${collaborator.role} with ${collaborator.portfolio}+ projects in my portfolio, I'm excited about "${project.title}". My background in ${collaborator.skills.slice(0, 3).join(", ")} aligns perfectly with what you're looking for. I'm particularly drawn to ${project.type.replace("-", " ")} projects and would love to contribute my creative vision to yours.`,

      `Your "${project.title}" project sounds incredible! I'm ${collaborator.name}, specializing in ${collaborator.skills[0]} and ${collaborator.skills[1]}. With a ${collaborator.rating}/5 rating from previous collaborations, I'm confident I can help elevate this ${project.type.replace("-", " ")} to the next level. Let's create something amazing together!`,

      `I'm really impressed by your "${project.title}" concept! As someone with ${collaborator.experience.toLowerCase()} experience in ${collaborator.skills.slice(0, 2).join(" and ")}, I see great potential for collaboration. My portfolio of ${collaborator.portfolio} projects has prepared me well for this type of creative challenge. Would love to discuss further!`,
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  return matchedCollaborators.slice(0, count).map((collaborator, index) => {
    const requestId = `auto-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`

    return {
      id: requestId,
      projectId: project.id,
      collaboratorId: collaborator.id,
      message: generatePersonalizedMessage(collaborator, project),
      status: "pending" as const,
      createdAt: new Date().toISOString().split("T")[0],
      collaborator: {
        id: collaborator.id,
        name: collaborator.name,
        role: collaborator.role,
        avatar: collaborator.avatar,
        rating: collaborator.rating,
      },
      project: {
        id: project.id,
        title: project.title,
        type: project.type,
      },
      type: "received" as const,
    }
  })
}

export function generateInitialCollaborators(project: Project, count = 2): Collaborator[] {
  const topMatches = getRecommendedCollaborators(project, count)
  return topMatches.slice(0, count)
}

export const collaborators = mockCollaborators
