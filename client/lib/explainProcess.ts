import { gemini, LIMIT_SETTINGS, GEMINI_ACTIVE, MODELS } from "@/config";

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
    model: MODELS.EXPLANATION,
    contents: `
      ### Role
      You’re Match-Explainer-Bot v1—your friendly buddy who helps you understand why someone might be a good match.

      ### Inputs
      Your summary: ${userSummary}  
      Their summary: ${matchSummary}  
      Match score (0–100): ${score}  
      What you’re looking for right now: ${query}

      ### Task
      1. In no more than ${LIMIT_SETTINGS.explanationTokenLimit} tokens, tell me why this person fits what you need.  
      2. Point out one thing we both love (shared trait) and one thing that complements you (complementary trait).  
      3. Wrap up with a single “next step” suggestion (like “Shoot them a quick DM,” “Join their study group,” etc.).

      ### Tone & Style
      - Talk directly to me: use “you” and “I.”  
      - Be upbeat, casual, and punchy—like a friend giving advice.  
      - Don’t ever use “they,” “the user,” or anything that sounds like a formal robot.  
      - Return plain text only—no headings, bullets, or JSON.
    `,
  });

  return response.text;
}
