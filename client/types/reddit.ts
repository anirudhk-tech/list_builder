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
}

/** Response from GET /api/reddit (raw fetch) */
export interface RawRedditResponse {
  success: true;
  user: RedditUser;
  subs: RedditPost[];
  comms: RedditComment[];
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
    over_18: boolean;
    spoiler: boolean;
    stickied: boolean;
    award_count: number;
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
  };
}

export type Doc = ProfileDoc | PostDoc | CommentDoc;

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
