export interface TabbProfile {
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
  profileUrl: string
}

// Temporary fallback data while AI processing is being set up
export const tabbProfiles: TabbProfile[] = [
  {
    id: "jordan-hare",
    name: "Jordan Hare",
    role: "Actor",
    location: "Hereford",
    bio: "I'm a post graduate student from Bristol where I have not only fought to find my own path in a forever exciting world within the industry but also discovered I'm fluently nutty about my work and continuous character discovery on a daily.",
    skills: ["Acting", "Character Development", "Theatre", "Screen Acting"],
    rating: 4.2,
    matchScore: 85,
    avatar:
      "https://res.cloudinary.com/tabb/image/upload/c_fill,dpr_1.0,f_auto,h_71,w_71/v1719140971/dddyll1frtyp1o4tazrk.jpg",
    availability: "available",
    experience: "Graduate Level",
    portfolio: 8,
    profileUrl: "https://tabb.cc/jordan-hare",
  },
  {
    id: "kirris-riviere",
    name: "Kirris Riviere",
    role: "Singer Songwriter",
    location: "Bristol",
    bio: "Kirris Riviere Actor. Musician Blues Singer, Songwriter. Screenwriter and Director.",
    skills: ["Singer Songwriter", "Lead Actor", "Scriptwriter", "Blues Music", "Directing"],
    rating: 4.6,
    matchScore: 92,
    avatar:
      "https://res.cloudinary.com/tabb/image/upload/c_fill,dpr_1.0,f_auto,h_71,w_71/v1687984790/dr5wffaizzcpa267x008.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 15,
    profileUrl: "https://tabb.cc/kirris-riviere",
  },
  {
    id: "peter-jenkins",
    name: "Peter Jenkins",
    role: "Actor",
    location: "Bristol/London",
    bio: "Actor-Writer with theatre credits (Macduff in Macbeth). Trained in Shakespeare, screen, physical theatre. Black belt martial artist. Developing original scripts. Bass singer, versatile dialects.",
    skills: ["Acting", "Writing", "Shakespeare", "Physical Theatre", "Martial Arts", "Voice Acting"],
    rating: 4.8,
    matchScore: 88,
    avatar:
      "https://res.cloudinary.com/tabb/image/upload/c_fill,dpr_1.0,f_auto,h_71,w_71/v1754941043/xpfx0wipbwkcsazdib4d.jpg",
    availability: "busy",
    experience: "Professional",
    portfolio: 22,
    profileUrl: "https://tabb.cc/peter-jenkins",
  },
  {
    id: "megan-tarrant",
    name: "Megan Tarrant",
    role: "Actor",
    location: "Bedford",
    bio: "Versatile actor and singer-songwriter with a passion for both dramatic and musical performances.",
    skills: ["Acting", "Singer Songwriter", "Musical Theatre", "Performance"],
    rating: 4.1,
    matchScore: 78,
    avatar:
      "https://res.cloudinary.com/tabb/image/upload/c_fill,dpr_1.0,f_auto,h_71,w_71/v1731162634/kuuyycl9ujnu5qm7rtvv.jpg",
    availability: "available",
    experience: "Emerging",
    portfolio: 6,
    profileUrl: "https://tabb.cc/megan-tarrant",
  },
  {
    id: "tez-smith",
    name: "Tez Smith",
    role: "Screenwriter",
    location: "Bath",
    bio: "Experienced screenwriter and scriptwriter specializing in compelling narratives and character development.",
    skills: ["Screenwriting", "Scriptwriting", "Story Development", "Character Writing"],
    rating: 4.4,
    matchScore: 82,
    avatar:
      "https://res.cloudinary.com/tabb/image/upload/c_fill,dpr_1.0,f_auto,h_71,w_71/v1697304058/mqwwphjewkmuntpsyidw.jpg",
    availability: "available",
    experience: "Professional",
    portfolio: 12,
    profileUrl: "https://tabb.cc/terence-smith",
  },
  {
    id: "sean-bailey",
    name: "Sean Bailey",
    role: "Director",
    location: "Bristol",
    bio: "Sean Bailey is a filmmaker based in the South West, he is currently directing a feature length movie. Trained as an actor at The Royal Central School Of Speech and Drama, he then went on to study sound design.",
    skills: ["Directing", "Writing", "Sound Design", "Filmmaking", "Acting"],
    rating: 4.7,
    matchScore: 94,
    avatar:
      "https://res.cloudinary.com/tabb/image/upload/c_fill,dpr_1.0,f_auto,h_71,w_71/v1686340471/pmwu4ts2x4dl6sttyyyh.png",
    availability: "busy",
    experience: "Professional",
    portfolio: 18,
    profileUrl: "https://tabb.cc/sean-bailey",
  },
]

// Function to load AI-processed profiles (will be called after processing)
export async function loadProcessedProfiles(): Promise<TabbProfile[]> {
  try {
    const response = await fetch("/api/process-profiles", { method: "POST" })
    const data = await response.json()

    if (data.success) {
      return data.profiles
    } else {
      console.warn("[v0] Using fallback profiles due to processing error")
      return tabbProfiles
    }
  } catch (error) {
    console.warn("[v0] Using fallback profiles due to fetch error:", error)
    return tabbProfiles
  }
}
