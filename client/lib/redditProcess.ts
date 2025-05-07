import { MODELS, openai, OPENAI_ACTIVE, SUMMARY_SETTINGS } from "@/config";
import {
  CommentDoc,
  Doc,
  PostDoc,
  ProfileDoc,
  RawRedditResponse,
} from "@/types/reddit";

function docsToText(docs: Doc[]): string {
  return docs
    .map((d) => {
      const prefix = `[${d.type.toUpperCase()}] `;
      return prefix + d.text;
    })
    .join("\n\n");
}

export async function summarizeRedditData(docs: Doc[]): Promise<string> {
  try {
    const text = docsToText(docs);

    if (!OPENAI_ACTIVE) {
      console.warn("OpenAI API is disabled. Cannot summarize Reddit data.");
      return "OpenAI API is disabled. Cannot summarize Reddit data.";
    }

    const completion = await openai.chat.completions.create({
      model: MODELS.SUMMARY,
      messages: [
        {
          role: "system",
          content: `You are an expert at distilling a user’s Reddit activity into a concise, ${SUMMARY_SETTINGS.tokenLimit}-token bio.`,
        },
        { role: "user", content: text },
        {
          role: "user",
          content: `Write me a single ${SUMMARY_SETTINGS.tokenLimit}-token summary of the above Reddit activity.`,
        },
      ],
    });

    return completion.choices[0].message?.content?.trim() ?? "";
  } catch (error) {
    console.error("Error summarizing Reddit data:", error);
    return "Error summarizing Reddit data.";
  }
}

export async function embedRedditData(docs: Doc[]): Promise<number[]> {
  try {
    if (!OPENAI_ACTIVE) {
      console.warn("OpenAI API is disabled. Cannot embed Reddit data.");
      return Array(1536).fill(0); // Return a zero vector
    }

    const text = docsToText(docs);

    const embedding = await openai.embeddings.create({
      model: MODELS.EMBEDDING,
      input: text,
    });

    return embedding.data[0].embedding;
  } catch (error) {
    console.error("Error embedding Reddit data:", error);
    return Array(1536).fill(0); // Return a zero vector
  }
}

export async function normalizeRedditData(
  data: RawRedditResponse
): Promise<Doc[]> {
  const { user, subs, comms } = data;

  const profileDoc: ProfileDoc = {
    id: user.id,
    type: "profile",
    text: user.subreddit.public_description || "",
    metadata: {
      created_utc: user.created_utc,
      link_karma: user.link_karma,
      comment_karma: user.comment_karma,
      total_karma: user.total_karma,
      awardee_karma: user.awardee_karma,
      awarder_karma: user.awarder_karma,
      public_description: user.subreddit.public_description,
      subreddit_subscribers: user.subreddit.subscribers,
    },
  };

  const postDocs: PostDoc[] = subs.map((p) => ({
    id: p.id,
    type: "post",
    text: p.title + "\n\n" + p.selftext,
    metadata: {
      subreddit: p.subreddit,
      subreddit_id: p.subreddit_id,
      created_utc: p.created_utc,
      score: p.score,
      ups: p.ups,
      downs: p.downs,
      num_comments: p.num_comments,
      over_18: p.over_18,
      spoiler: p.spoiler,
      stickied: p.stickied,
      award_count: p.all_awardings.length,
    },
  }));

  const commentDocs: CommentDoc[] = comms.map((c) => ({
    id: c.id,
    type: "comment",
    text: c.body,
    metadata: {
      subreddit: c.subreddit,
      link_id: c.link_id,
      parent_id: c.parent_id,
      created_utc: c.created_utc,
      score: c.score,
      controversiality: c.controversiality,
      is_submitter: c.is_submitter,
      stickied: c.stickied,
      award_count: c.all_awardings.length,
    },
  }));

  const docs: Doc[] = [profileDoc, ...postDocs, ...commentDocs];

  return docs;
}
