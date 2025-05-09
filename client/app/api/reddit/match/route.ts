import { supabase } from "@/config";
import { embedQuery, makeQuery } from "@/lib/matchProcess";
import { MatchCandidate } from "@/types/match";
import { UserMatch, UserMatchRequest } from "@/types/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      query,
      topK = 10,
      username,
      userSummary,
    } = ((await req.json()) as UserMatchRequest) || {};

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const finalQuery = await makeQuery(userSummary, query);
    const queryVec = await embedQuery(finalQuery);
    const { data, error } = await supabase.rpc("match_profiles", {
      query_vec: queryVec,
      k_limit: topK,
      username,
    });

    if (error) {
      console.error("Error fetching match candidates:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const D = 2.0;
    const results: MatchCandidate[] = data!.map((row: UserMatch) => {
      const sim = Math.max(0, 1 - row.dist / D);
      const score = Math.round(sim * 100);
      return {
        id: row.id,
        redditUsername: row.reddit_username,
        score,
        summary: row.summary,
        avatarUrl: row.avatar_url,
      } as MatchCandidate;
    });

    return NextResponse.json<{ results: MatchCandidate[] }>({ results });
  } catch (error) {
    console.error("Error in /api/reddit/match:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
