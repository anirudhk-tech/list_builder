import {
  embedRedditData,
  normalizeRedditData,
  summarizeRedditData,
} from "@/lib/redditProcess";
import {
  Listing,
  ProcessedRedditResponse,
  RawRedditResponse,
  RedditComment,
  RedditPost,
  RedditUser,
} from "@/types/reddit";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/* Helper function to fetch JSON data from Reddit API */
async function fetchJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  return response.json();
}

/* Main function to fetch and process reddit data */
export async function POST(request: NextRequest) {
  const REDDIT_API_URL = "https://oauth.reddit.com";

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  // Fetch user data from Reddit API
  const me = await fetchJson<RedditUser>(
    `${REDDIT_API_URL}/api/v1/me`,
    token.accessToken as string
  );

  const [subs, comms] = await Promise.all([
    // 50 subs, 100 comments
    fetchJson<Listing<RedditPost>>(
      `${REDDIT_API_URL}/user/${me.name}/submitted?limit=50`,
      token.accessToken as string
    ),
    fetchJson<Listing<RedditComment>>(
      `${REDDIT_API_URL}/user/${me.name}/comments?limit=100`,
      token.accessToken as string
    ),
  ]);

  const raw: RawRedditResponse = {
    success: true,
    user: me,
    subs: subs.data.children.map((sub) => sub.data),
    comms: comms.data.children.map((com) => com.data),
  };

  // Normalize, embed, and summarize the data
  const docs = await normalizeRedditData(raw);
  const embedding = await embedRedditData(docs);
  const summary = await summarizeRedditData(docs);

  // Prepare the response
  const response = {
    raw,
    summary,
    embedding,
    docs,
  };

  // Return the processed response (for upsert later)
  return NextResponse.json<ProcessedRedditResponse>(response);
}
