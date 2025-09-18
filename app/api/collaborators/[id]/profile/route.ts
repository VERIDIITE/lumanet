import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collaboratorId = params.id

    // Mock comprehensive profile data - in production, this would come from your database
    const profileData = {
      "1": {
        id: "1",
        name: "Bashart Malik",
        role: "Director & Cinematographer",
        location: "Bristol, United Kingdom",
        bio: "Over 15 years of experience as a Director and DOP in commercials, music videos and features. With a special passion for crafting imaginative visuals using narrative and light.",
        avatar: "/professional-filmmaker-headshot.jpg",
        rating: 4.9,
        availability: "available",
        skills: ["Director", "Cinematographer", "Color Grading", "Narrative Storytelling", "Commercial Production"],
        experience:
          "I've spent over 15 years crafting visual stories that resonate with audiences worldwide. My journey began in Bristol's vibrant creative scene, where I developed my signature style of combining cinematic storytelling with innovative visual techniques. I've had the privilege of working with major brands, independent artists, and emerging filmmakers, always bringing the same level of passion and professionalism to every project. My approach focuses on understanding the emotional core of each story and translating that into compelling visuals that connect with viewers on a deeper level.",
        portfolio: [
          {
            id: "p1",
            title: "I Am Judah",
            type: "Cinematic Documentary",
            year: "2022",
            description:
              "Ras Judah, a completely innocent man, was brutally tasered in the face by the police as he was returning home while out walking his dog. This powerful documentary explores themes of justice, identity, and resilience in the face of systemic oppression.",
            thumbnail: "/placeholder-okw0x.png",
            videoUrl: "https://example.com/video1",
            images: ["/placeholder-wy8kp.png", "/placeholder-7njng.png"],
            role: "Director & Cinematographer",
            awards: ["Best Documentary - Bristol Film Festival", "Audience Choice Award - UK Doc Fest"],
          },
          {
            id: "p2",
            title: "Urban Echoes",
            type: "Music Video",
            year: "2023",
            description:
              "A visually striking music video that captures the raw energy of underground hip-hop culture in Bristol. Shot entirely on location using natural lighting and handheld cameras to create an authentic, gritty aesthetic.",
            thumbnail: "/placeholder-12pbt.png",
            videoUrl: "https://example.com/video2",
            images: ["/music-video-production.png", "/placeholder-bqw97.png"],
            role: "Director & DOP",
          },
          {
            id: "p3",
            title: "Midnight Conversations",
            type: "Short Film",
            year: "2021",
            description:
              "An intimate character study exploring themes of loneliness and connection in modern urban life. The film uses minimal dialogue and relies heavily on visual storytelling and atmospheric cinematography.",
            thumbnail: "/placeholder-4fzel.png",
            images: ["/placeholder-23f0q.png", "/placeholder-2ohw7.png"],
            role: "Director & Cinematographer",
            awards: ["Best Cinematography - Short Film Awards"],
          },
        ],
        testimonials: [
          {
            id: "t1",
            name: "Sarah Chen",
            role: "Producer",
            company: "Indie Films UK",
            text: "Working with Bashart was an absolute pleasure. His vision and technical expertise brought our project to life in ways we never imagined. He has an incredible ability to capture emotion through his lens.",
            rating: 5,
            avatar: "/placeholder-j48dd.png",
          },
          {
            id: "t2",
            name: "Marcus Johnson",
            role: "Music Artist",
            company: "Independent",
            text: "Bashart understood my music on a deeper level and translated that into visuals that perfectly complemented my sound. The music video he created exceeded all my expectations.",
            rating: 5,
            avatar: "/placeholder-j2fbb.png",
          },
          {
            id: "t3",
            name: "Emma Thompson",
            role: "Creative Director",
            company: "Brand Studios",
            text: "His attention to detail and creative problem-solving skills are exceptional. Bashart delivered a commercial that not only looked stunning but also effectively communicated our brand message.",
            rating: 5,
            avatar: "/creative-director-professional.png",
          },
        ],
        contact: {
          email: "bashart@example.com",
          phone: "+44 7123 456789",
          website: "www.bashartmalik.com",
        },
        stats: {
          projectsCompleted: 127,
          yearsExperience: 15,
          collaborators: 89,
          awards: 12,
        },
      },
      "2": {
        id: "2",
        name: "Maya Rodriguez",
        role: "Sound Engineer & Composer",
        location: "Los Angeles, CA",
        bio: "Award-winning sound engineer and composer with expertise in film scoring, sound design, and audio post-production. Passionate about creating immersive audio experiences.",
        avatar: "/professional-sound-engineer-woman.jpg",
        rating: 4.8,
        availability: "busy",
        skills: ["Sound Design", "Film Scoring", "Audio Post-Production", "Music Composition", "Pro Tools"],
        experience:
          "With over 12 years in the audio industry, I've worked on everything from indie films to major studio productions. My passion lies in creating soundscapes that enhance storytelling and evoke emotion. I believe that great audio is invisible - it should support and elevate the visual narrative without drawing attention to itself.",
        portfolio: [
          {
            id: "p1",
            title: "Echoes of Tomorrow",
            type: "Feature Film Score",
            year: "2023",
            description:
              "Original score for a sci-fi thriller featuring orchestral and electronic elements. The music needed to convey both the wonder of discovery and the tension of impending danger.",
            thumbnail: "/recording-studio-orchestra-session.jpg",
            role: "Composer & Sound Designer",
            awards: ["Best Original Score - Independent Film Awards"],
          },
        ],
        testimonials: [
          {
            id: "t1",
            name: "David Park",
            role: "Director",
            company: "Visionary Films",
            text: "Maya's score elevated our film to another level. Her ability to understand the emotional beats of the story and translate them into music is remarkable.",
            rating: 5,
            avatar: "/film-director-professional.jpg",
          },
        ],
        contact: {
          email: "maya@example.com",
          website: "www.mayarodriguezaudio.com",
        },
        stats: {
          projectsCompleted: 89,
          yearsExperience: 12,
          collaborators: 156,
          awards: 8,
        },
      },
    }

    const profile = profileData[collaboratorId as keyof typeof profileData]

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ success: false, error: "Failed to load profile" }, { status: 500 })
  }
}
