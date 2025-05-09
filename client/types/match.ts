export interface MatchCandidate {
  id: number;
  redditUsername: string;
  score: number;
  summary: string;
  avatarUrl: string;
  explanation?: string;
}
