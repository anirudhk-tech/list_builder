import {
  embedSummary,
  normalizeRedditData,
  selectDocs,
  summarizeRedditData,
} from "@/lib/redditProcess";
import {
  Listing,
  ProcessedRedditResponse,
  RawRedditResponse,
  RedditComment,
  RedditPost,
  RedditUser,
  RedditSubreddit,
  KarmaListing,
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
    secureCookie: true,
  });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  // Fetch user data from Reddit API
  const user = await fetchJson<RedditUser>(
    `${REDDIT_API_URL}/api/v1/me`,
    token.accessToken as string
  );

  const [subs, comms] = await Promise.all([
    // 100 subs, 100 comments
    fetchJson<Listing<RedditPost>>(
      `${REDDIT_API_URL}/user/${user.name}/submitted?limit=100`,
      token.accessToken as string
    ),
    fetchJson<Listing<RedditComment>>(
      `${REDDIT_API_URL}/user/${user.name}/comments?limit=100`,
      token.accessToken as string
    ),
  ]);

  const subscrList = await fetchJson<Listing<RedditSubreddit>>( // Fetch subscribed subreddits
    // 100 subs
    `${REDDIT_API_URL}/subreddits/mine/subscriber?limit=100`,
    token.accessToken as string
  );

  const karma = await fetchJson<KarmaListing>(
    // Fetch karma for each subreddit
    `${REDDIT_API_URL}/api/v1/me/karma`,
    token.accessToken as string
  );

  const raw: RawRedditResponse = {
    success: true,
    user: user,
    subs: subs.data.children.map((sub) => sub.data),
    comms: comms.data.children.map((com) => com.data),
    subscrList: subscrList.data.children.map((sub) => sub.data),
    karmaList: karma.data.karma,
  };

  // Normalize, embed, and summarize the data
  const docs = await normalizeRedditData(raw);
  const highValueDocs = await selectDocs(docs);
  const summary = await summarizeRedditData(highValueDocs);
  const embedding = await embedSummary(summary);

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
