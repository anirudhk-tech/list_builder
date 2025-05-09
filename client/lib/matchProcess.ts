import { LIMIT_SETTINGS, MODELS, openai, OPENAI_ACTIVE } from "@/config";

export async function embedQuery(query: string) {
  if (!OPENAI_ACTIVE) {
    console.error("OpenAI API is not active. Skipping embedding query.");
    return Array(1536).fill(0); // Return a zero vector of the same size as the embedding
  }
  const embedding = await openai.embeddings.create({
    model: MODELS.EMBEDDING,
    input: query,
  });

  return embedding.data[0].embedding;
}

export async function makeQuery(summary: string, query: string) {
  const clamp = (text: string) =>
    text.split(/\s+/).slice(0, LIMIT_SETTINGS.queryTokenLimit).join(" ");

  return (
    `### User Summary\n` +
    `${clamp(summary)}\n\n` +
    `### Looking For\n` +
    `${clamp(query)}`
  );
}
