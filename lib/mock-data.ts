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

// Real collaborators from tabb.cc/profiles
export const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Graciela Watson",
    role: "Director & Producer",
    location: "Bristol, United Kingdom",
    bio: "A TV professional with years making factual entertainment programmes and a strong desire to keep telling stories, dramatic or real.",
    skills: ["Director", "Producer", "Documentary Maker", "Scriptwriter", "Video Producer"],
    rating: 4.8,
    matchScore: 95,
    avatar: "/professional-female-tv-director-with-years-of-expe.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 12,
    profileUrl: "https://tabb.cc/graciela-watson",
  },
  {
    id: "2",
    name: "Shannon R. Hammond",
    role: "Producer",
    location: "Southampton, United Kingdom",
    bio: "Shannon's keen eye for detail and innovative approach guarantee that every project she undertakes will be of the highest quality. Whether she is crafting emotive narrative content or bringing unique visions to life.",
    skills: ["Producer", "Content Creation", "Project Management", "Narrative Development"],
    rating: 4.9,
    matchScore: 92,
    avatar: "/professional-female-producer-with-keen-eye-for-det.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 8,
    profileUrl: "https://tabb.cc/shannon-hammond",
  },
  {
    id: "3",
    name: "Sean Bailey",
    role: "Director & Writer",
    location: "Bristol, United Kingdom",
    bio: "Sean Bailey is an independent director based in the South West, currently working on a feature, Finnegans Puddle. Trained at the Royal Central School Of Speech and Drama.",
    skills: ["Director", "Writer", "Actor", "Sound Designer", "Feature Films"],
    rating: 4.7,
    matchScore: 88,
    avatar: "/independent-male-film-director-trained-at-royal-ce.jpg",
    availability: "busy",
    experience: "Professional",
    portfolio: 15,
    profileUrl: "https://tabb.cc/sean-bailey",
  },
  {
    id: "4",
    name: "Lux Goldman",
    role: "DoP & Gaffer",
    location: "Bristol/Newport/Cardiff/London, United Kingdom",
    bio: "Non-binary DOP & Gaffer, looking to build up my portfolio. Especially interested in sci-fi & queer stories. Owner-operator with C70 & BMPCC6k Pro.",
    skills: ["DoP", "Aerial Cinematographer", "Grip", "Gaffer", "Cinematography", "Sci-Fi Specialist"],
    rating: 4.6,
    matchScore: 90,
    avatar: "/non-binary-cinematographer-and-gaffer-specializing.jpg",
    availability: "available",
    experience: "Emerging",
    portfolio: 6,
    profileUrl: "https://tabb.cc/lux",
  },
  {
    id: "5",
    name: "Ashley Porciuncula",
    role: "Director & Producer",
    location: "Bristol/London, United Kingdom",
    bio: "Ashley Porciuncula is a Californian-born filmmaker, director, producer, and digital consultant. She is passionate about storytelling, gamification psychology.",
    skills: ["Director", "Producer", "Executive Producer", "Digital Strategy", "Storytelling"],
    rating: 4.8,
    matchScore: 87,
    avatar: "/californian-born-female-filmmaker-and-digital-cons.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 20,
    profileUrl: "https://tabb.cc/ashley-porciuncula",
  },
  {
    id: "6",
    name: "Bashart Malik",
    role: "Director & DOP",
    location: "Bristol, United Kingdom",
    bio: "Over 15 years of experience as a Director and DOP in commercials, music videos and features. With a special passion for crafting imaginative visuals using narrative and light.",
    skills: [
      "Director",
      "Director Of Photography",
      "Cinematography",
      "Visual Storytelling",
      "Commercials",
      "Music Videos",
    ],
    rating: 4.9,
    matchScore: 94,
    avatar: "/experienced-male-director-and-cinematographer-with.jpg",
    availability: "busy",
    experience: "Professional",
    portfolio: 25,
    profileUrl: "https://tabb.cc/bashart-malik",
  },
  {
    id: "7",
    name: "Oliver Park",
    role: "Horror Director & Writer",
    location: "Bristol, United Kingdom",
    bio: "I strive to innovate in the horror genre, and to leave audiences eagerly dreading what's next.",
    skills: ["Director", "Writer", "Horror Specialist", "Genre Filmmaking", "Thriller"],
    rating: 4.5,
    matchScore: 85,
    avatar: "/male-horror-film-director-specializing-in-innovati.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 10,
    profileUrl: "https://tabb.cc/oliver-park",
  },
  {
    id: "8",
    name: "Tom Brereton Downs",
    role: "Director & Producer",
    location: "Bath, United Kingdom",
    bio: "Tom loves to support people in uncovering and showing off their particularly brand of brilliance. Founder of Screenology, Bristol's innovative Creative Filmmaking Degree programme.",
    skills: ["Director", "Producer", "Editor", "Filmmaker", "Education", "Creative Coaching"],
    rating: 4.7,
    matchScore: 89,
    avatar: "/male-filmmaker-and-educator-founder-of-creative-fi.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 18,
    profileUrl: "https://tabb.cc/tom-brereton-downs",
  },
  {
    id: "9",
    name: "Aron Weston",
    role: "Filmmaker & Photographer",
    location: "Bristol/Pembrokeshire, United Kingdom",
    bio: "22 year old filmmaker specialising in Writing, Directing, Cinematography and Photography.",
    skills: ["Director", "Screenwriter", "Videographer", "DoP", "Photographer", "Young Talent"],
    rating: 4.4,
    matchScore: 82,
    avatar: "/young-22-year-old-male-filmmaker-and-photographer-.jpg",
    availability: "available",
    experience: "Emerging",
    portfolio: 5,
    profileUrl: "https://tabb.cc/aron-weston",
  },
  {
    id: "10",
    name: "Corey William Price",
    role: "Independent Filmmaker",
    location: "Bristol/Bath, United Kingdom",
    bio: "Bristol-based filmmaker. Directing, producing and writing my own films - always open to collaborate.",
    skills: ["Director", "Scriptwriter", "Producer", "Independent Films"],
    rating: 4.6,
    matchScore: 86,
    avatar: "/bristol-based-independent-male-filmmaker-director-.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 9,
    profileUrl: "https://tabb.cc/corey",
  },
  {
    id: "11",
    name: "Sylvia Clegg",
    role: "Experienced Actor & Singer",
    location: "Chippenham, United Kingdom",
    bio: "I've been acting almost all my life and involved in the film industry for 30+ years. Always looking for new people to collaborate with. Willing to travel for projects that are interesting and exciting!",
    skills: ["Actor", "Singer", "Performance", "Veteran Talent", "Musical Theatre"],
    rating: 4.8,
    matchScore: 91,
    avatar: "/experienced-female-actor-and-singer-with-30-years-.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 30,
    profileUrl: "https://tabb.cc/sylvia-clegg",
  },
  {
    id: "12",
    name: "René Adams",
    role: "Actor & Stunt Performer",
    location: "Gloucester, United Kingdom",
    bio: "Trainee SPACT and SA with martial arts background.",
    skills: ["Actor", "Supporting Artist", "Co-Writer", "Martial Arts", "Stunts"],
    rating: 4.3,
    matchScore: 78,
    avatar: "/actor-and-stunt-performer-with-martial-arts-backgr.jpg",
    availability: "available",
    experience: "Emerging",
    portfolio: 3,
    profileUrl: "https://tabb.cc/rene-adams",
  },
  {
    id: "13",
    name: "Paul Llewellyn",
    role: "Writer/Director",
    location: "Bristol, United Kingdom",
    bio: "Writer/director of a few still imaginary films.",
    skills: ["Director", "Videographer", "Editor", "Creative Writing"],
    rating: 4.2,
    matchScore: 75,
    avatar: "/male-writer-and-director-working-on-creative-film-.jpg",
    availability: "available",
    experience: "Emerging",
    portfolio: 2,
    profileUrl: "https://tabb.cc/paul-llewellyn",
  },
  {
    id: "14",
    name: "George Salt",
    role: "Writer & Producer",
    location: "Bristol, United Kingdom",
    bio: "Writer, Producer, Self shooting PD.",
    skills: ["Writer", "Producer", "Director", "Self-Shooting", "Production"],
    rating: 4.5,
    matchScore: 83,
    avatar: "/male-writer-and-producer-who-is-self-shooting-prod.jpg",
    availability: "busy",
    experience: "Professional",
    portfolio: 11,
    profileUrl: "https://tabb.cc/george-salt",
  },
  {
    id: "15",
    name: "Maximillian Ian McCall",
    role: "Assistant Director",
    location: "Hindhead, United Kingdom",
    bio: "You know what they say, when life gives you lemons, you make a film about lemons",
    skills: [
      "Director",
      "Production Runner",
      "3rd Assistant Director",
      "2nd Assistant Director",
      "1st Assistant Director",
    ],
    rating: 4.4,
    matchScore: 80,
    avatar: "/male-assistant-director-with-positive-attitude-and.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 7,
    profileUrl: "https://tabb.cc/maximillian-ian-mccall",
  },
  {
    id: "16",
    name: "Judith Hutchins",
    role: "Actor & Presenter",
    location: "Bath/Bristol, United Kingdom",
    bio: "Previous acting experience confined to theatre, but have worked as a presenter and director in TV. I'm new to film but keen to do more.",
    skills: ["Actor", "Presenter", "Theatre", "TV Experience"],
    rating: 4.3,
    matchScore: 77,
    avatar: "/placeholder.svg?height=400&width=400",
    availability: "available",
    experience: "Professional",
    portfolio: 8,
    profileUrl: "https://tabb.cc/judith-hutchins",
  },
]

export const mockProjects: Project[] = [
  {
    id: "1",
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
    id: "2",
    title: "Music Video Concept",
    type: "music-video",
    description: "Experimental music video with surreal visuals and creative cinematography for an indie rock band.",
    budget: "5k-10k",
    timeline: "1-month",
    lookingFor: ["Director", "VFX Artist", "Choreographer"],
    status: "recruiting",
    collaborators: 1,
    requests: 8,
    deadline: "2024-03-01",
    createdBy: "user-1",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    title: "Documentary: Local Artists",
    type: "documentary",
    description: "Feature-length documentary following three local artists as they prepare for a major exhibition.",
    budget: "10k+",
    timeline: "6-months+",
    lookingFor: ["Producer", "Sound Recordist", "Editor"],
    status: "recruiting",
    collaborators: 2,
    requests: 15,
    deadline: "2024-08-01",
    createdBy: "user-2",
    createdAt: "2024-01-05",
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
      id: "1",
      title: "Indie Horror Short",
      type: "short-film",
    },
    type: "received",
  },
  {
    id: "2",
    projectId: "2",
    collaboratorId: "6",
    message:
      "This music video concept sounds amazing! I have extensive experience with music videos and creative visual storytelling. I'd love to bring this vision to life.",
    status: "pending",
    createdAt: "2024-01-16",
    collaborator: {
      id: "6",
      name: "Bashart Malik",
      role: "Director & DOP",
      avatar: "/experienced-male-director-and-cinematographer-with.jpg",
      rating: 4.9,
    },
    project: {
      id: "2",
      title: "Music Video Concept",
      type: "music-video",
    },
    type: "received",
  },
  {
    id: "3",
    projectId: "1",
    collaboratorId: "4",
    message:
      "I'm particularly interested in sci-fi and genre stories. Your horror short sounds like a great opportunity to experiment with lighting and create atmosphere.",
    status: "pending",
    createdAt: "2024-01-14",
    collaborator: {
      id: "4",
      name: "Lux Goldman",
      role: "DoP & Gaffer",
      avatar: "/non-binary-cinematographer-and-gaffer-specializing.jpg",
      rating: 4.6,
    },
    project: {
      id: "1",
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
  if (collaborator.experience === "Professional") score += 5

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

export const collaborators = mockCollaborators
