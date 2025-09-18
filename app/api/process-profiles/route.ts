import { NextResponse } from "next/server"
import { processRawProfilesWithAI } from "@/lib/ai-data-processor"
import rawProfiles from "@/data/raw-tabb-profiles.json"

export async function POST() {
  try {
    console.log("[v0] Starting AI profile processing...")

    const processedProfiles = await processRawProfilesWithAI(rawProfiles)

    return NextResponse.json({
      success: true,
      profiles: processedProfiles,
      count: processedProfiles.length,
    })
  } catch (error) {
    console.error("[v0] Error processing profiles:", error)
    return NextResponse.json({ error: "Failed to process profiles", details: error.message }, { status: 500 })
  }
}
