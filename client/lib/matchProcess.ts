import { MatchCandidate } from "@/types/match";

function cosineSimilarity(a: number[], b: number[]) {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot  += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

export function findBestMatch()
const candidates: MatchCandidate[] = 