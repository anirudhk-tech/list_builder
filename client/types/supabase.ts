import { RawRedditResponse } from "./reddit";

/**
 * What the client will POST to /api/profiles/upsert
 */
export interface UserUpsert {
  reddit_username: string;
  raw_data: RawRedditResponse;
  summary: string;
  embedding: number[];
}

/**
 * What the client will GET from /api/profiles/fetch
 */
export interface UserFetch {
  reddit_username: string;
  updated_at: string;
}
