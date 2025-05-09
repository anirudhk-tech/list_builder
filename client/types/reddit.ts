// src/types/api.ts

/** The wrapper that Reddit uses for both posts & comments */
export interface Listing<T> {
  kind: "Listing";
  data: {
    after: string | null;
    before: string | null;
    children: Array<{ kind: string; data: T }>;
  };
}

export interface KarmaListing {
  kind: string;
  data: {
    karma: Array<{
      sr: string; // subreddit name without the "r/"
      comment_karma: number;
      link_karma: number;
    }>;
  };
}

// ─── 1) Raw Reddit data endpoint ────────────────────────────────────────────────

/** Minimal user‐level profile fields */
export interface RedditUser {
  id: string;
  name: string;
  created_utc: number;
  link_karma: number;
  comment_karma: number;
  total_karma: number;
  awardee_karma: number;
  awarder_karma: number;
  icon_img: string;
  snoovatar_img: string;
  over_18: boolean;
  subreddit: {
    public_description: string;
    subscribers: number;
  };
  // any prefs you pull, e.g.:
  pref_nightmode?: boolean;
  pref_no_profanity?: boolean;
}

/** Minimal post (submission) fields */
export interface RedditPost {
  id: string;
  name: string; // e.g. "t3_abcdef"
  subreddit: string;
  subreddit_id: string;
  title: string;
  selftext: string;
  created_utc: number;
  score: number;
  ups: number;
  downs: number;
  num_comments: number;
  over_18: boolean;
  spoiler: boolean;
  stickied: boolean;
  all_awardings: unknown[];
}

/** Minimal subreddit fields */
export interface RedditSubreddit {
  id: string;
  display_name_prefixed: string;
  public_description: string;
  subscribers: number;
  over_18: boolean;
}

/** Minimal comment fields */
export interface RedditComment {
  id: string;
  name: string; // e.g. "t1_xyz123"
  subreddit: string;
  link_id: string; // parent post
  parent_id: string; // parent comment or post
  body: string;
  created_utc: number;
  score: number;
  controversiality: number;
  is_submitter: boolean;
  stickied: boolean;
  all_awardings: unknown[];
  over_18: boolean;
}

/** Karma to check subreddit engagement*/
export interface RedditSubredditKarma {
  sr: string; // subreddit name without the "r/"
  comment_karma: number;
  link_karma: number;
}

/** Response from GET /api/reddit (raw fetch) */
export interface RawRedditResponse {
  success: true;
  user: RedditUser;
  subs: RedditPost[];
  comms: RedditComment[];
  subscrList: RedditSubreddit[];
  karmaList: RedditSubredditKarma[];
}

// ─── 2) “Refresh & normalize” endpoint ────────────────────────────────────────

/** Common base for our normalized “doc” objects */
interface BaseDoc {
  id: string;
  type: string;
  text: string;
}

/** Profile doc (your “bio” chunk) */
export interface ProfileDoc extends BaseDoc {
  type: "profile";
  metadata: {
    created_utc: number;
    link_karma: number;
    comment_karma: number;
    total_karma: number;
    awardee_karma: number;
    awarder_karma: number;
    public_description: string;
    subreddit_subscribers: number;
    over_18: boolean;
  };
}

/** Post doc */
export interface PostDoc extends BaseDoc {
  type: "post";
  metadata: {
    subreddit: string;
    subreddit_id: string;
    created_utc: number;
    score: number;
    ups: number;
    downs: number;
    num_comments: number;
    spoiler: boolean;
    stickied: boolean;
    award_count: number;
    over_18: boolean;
  };
}

/** Comment doc */
export interface CommentDoc extends BaseDoc {
  type: "comment";
  metadata: {
    subreddit: string;
    link_id: string;
    parent_id: string;
    created_utc: number;
    score: number;
    controversiality: number;
    is_submitter: boolean;
    stickied: boolean;
    award_count: number;
    over_18: boolean;
  };
}

/** Subscription doc (your “subreddits” chunk) */
export interface SubscriptionDoc extends BaseDoc {
  type: "subscription";
  metadata: { subscribers: number; over_18: boolean; personalKarma: number };
}

export type Doc = ProfileDoc | PostDoc | CommentDoc | SubscriptionDoc;

/** Response from POST /api/reddit/process */
export interface ProcessedRedditResponse {
  embedding: number[];
  summary: string;
  docs: Doc[];
  raw: RawRedditResponse;
}

// ─── 3) Search + match scoring endpoint ───────────────────────────────────────

/** Request body for POST /api/search */
export interface SearchRequest {
  query: string;
}

/** Single match result */
export interface MatchResult {
  id: string; // candidate’s profile ID
  redditUsername: string; // for display
  score: number; // 0–100
  rationale: string;
}

/** Response from POST /api/search */
export interface SearchResponse {
  results: MatchResult[];
}

// ─── 4) User match explanation endpoint ────────────────────────────────────────
export interface MatchExplanationRequest {
  query: string;
  score: number;
  matchSummary: string;
  userSummary: string;
}
