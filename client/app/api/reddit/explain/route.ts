import { explainMatch } from "@/lib/explainProcess";
import { MatchExplanationRequest } from "@/types/reddit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userSummary, query, matchSummary, score } =
      ((await req.json()) as MatchExplanationRequest) || {};

    if (!query || !userSummary || !matchSummary) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const explanation = await explainMatch(
      userSummary,
      query,
      matchSummary,
      score
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error in /api/reddit/explain:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
