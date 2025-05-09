import { RawRedditResponse } from "./reddit";

/**
 * What the client will POST to /api/profiles/upsert
 */
export interface UserUpsert {
  reddit_username: string;
  raw_data: RawRedditResponse;
  summary: string;
  embedding: number[];
  avatar_url: string;
}

/**
 * What the client will GET from /api/profiles/fetch
 */
export interface User {
  reddit_username: string;
  updated_at: string;
  avatar_url: string;
  summary: string;
}

export interface UserMatch {
  id: number;
  reddit_username: string;
  summary: string;
  dist: number;
  avatar_url: string;
}

/*
 * What the client will POST to /api/profiles/match
 */
export interface UserMatchRequest {
  query: string;
  username: string;
  topK?: number;
  userSummary: string;
}
