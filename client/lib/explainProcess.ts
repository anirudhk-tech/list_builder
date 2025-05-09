import { gemini, LIMIT_SETTINGS, GEMINI_ACTIVE } from "@/config";

export async function explainMatch(
  userSummary: string,
  query: string,
  matchSummary: string,
  score: number
) {
  if (!GEMINI_ACTIVE) {
    console.warn("Gemini is not active. Skipping explanation generation.");
    return "Gemini is not active. Generation was skipped.";
  }
  const response = await gemini.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `
        ### Role
        You are Match-Explainer-Bot v1. Turn raw similarity data into a friendly human summary.

        ### Inputs
        User summary: ${userSummary}
        Candidate summary: ${matchSummary}
        Similarity score (0-100): ${score}
        User’s current need: ${query}

        ### Task
        1 . In ≤${LIMIT_SETTINGS.explanationTokenLimit} tokens, explain WHY this candidate fits the user’s current need.  
        2 . Mention ONE shared trait and ONE complementary trait.  
        3 . Close with a 1-sentence suggestion for the next step (DM, study session, etc.).

        ### Output
        Return plain text, no headings, no bullet marks, no JSON.
    `,
  });

  return response.text;
}
