import { MODELS, openai, OPENAI_ACTIVE, LIMIT_SETTINGS } from "@/config";
import {
  CommentDoc,
  Doc,
  PostDoc,
  ProfileDoc,
  RawRedditResponse,
  SubscriptionDoc,
} from "@/types/reddit";

const SYS_PROMPT = `
[First Layer - Details]
You are Personality‑Synthesizer v3. Generate a vivid Reddit‑footprint bio no longer than ${LIMIT_SETTINGS.summaryTokenLimit} tokens.
Required domains (include all six):

Core values & worldview

Career & academic interests

Creative / cultural tastes

Social style & community vibe

Lifestyle habits & routines

Balance rules: no single domain may exceed 25 % of the tokens.
Tone: upbeat, third‑person, 2‑3 punchy sentences.
No PII, hashtags, clichés, or speculation.
No NSFW, politics, or religion.

[Second Layer - Steps]

Sample subreddits first, then posts/comments.

Cluster signals into the six domains.

Allocate tokens (~13 per domain, respecting 25 % cap).

Craft sentences weaving domains naturally.

Verify token count, balance, and mandatory mentions.

Output only the final bio text.

[Third Layer - Example]
Code‑savvy UIC student who prototypes AI tools by day and devours cyber‑punk novels & anime lore by night. Values pragmatic problem‑solving, climate‑friendly hacks, and mentoring peers in campus dev clubs. Re‑charges with sunrise runs and aims to turn side projects into inclusive startups.

[Fourth Layer - Format]
Return the bio text only. No subreddit text like r/example, no headers, citations, or extra formatting.
`.trim();

const STOPWORDS = new Set([
  "the",
  "and",
  "a",
  "to",
  "for",
  "of",
  "in",
  "on",
  "it",
  "that",
  "is",
  "this",
  "i",
  "you",
  "me",
  "my",
  "thanks",
  "thank",
  "👍",
  "oh",
  "bet",
  "cool",
  "nice",
  "got",
  "it",
  "yup",
  "yeah",
  "sure",
]);
const GENERIC_RE =
  /^(bet|got it|oh that's a good one|nice|cool|thanks[!]?|👍+|\s*)$/i;
const PRONOUNS = new Set([
  "i",
  "me",
  "my",
  "mine",
  "we",
  "our",
  "ours",
  "you",
  "your",
  "yours",
  "he",
  "him",
  "his",
  "she",
  "her",
  "hers",
  "they",
  "them",
  "their",
  "theirs",
]);

function docsToText(docs: Doc[]): string {
  const profile = docs.find((d) => d.type === "profile");
  const subs = docs
    .filter((d) => d.type === "subscription")
    .map((d) => `[SUB] ${d.text} (karma: ${d.metadata.personalKarma ?? 0})`)
    .join("\n");
  const rest = docs
    .filter((d) => d.type !== "subscription")
    .map((d) => {
      const prefix = `[${d.type.toUpperCase()}] `;
      return prefix + d.text;
    })
    .join("\n\n");

  return [
    profile && `[PROFILE] ${profile.text}`,
    "HIGH VALUE SUBREDDITS:",
    subs,
    rest,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function selectPosts(
  all: PostDoc[],
  topSubNames: string[],
  desiredCount = 5
): PostDoc[] {
  // 1. Group & sort
  const bySub = new Map<string, PostDoc[]>();
  for (const d of all) {
    const sub = d.metadata.subreddit;
    if (!bySub.has(sub)) bySub.set(sub, []);
    bySub.get(sub)!.push(d as PostDoc);
  }
  for (const posts of bySub.values()) {
    posts.sort((a, b) => b.metadata.score - a.metadata.score);
  }

  const result: PostDoc[] = [];
  const usedSubs = new Set<string>();

  // 2. Stage 1: topSubNames (one each)
  for (const sub of topSubNames) {
    if (result.length >= desiredCount) break;
    const bucket = bySub.get(sub);
    if (bucket && bucket.length) {
      result.push(bucket.shift()!);
      usedSubs.add(sub);
    }
  }

  // 3. Stage 2: other subreddits (one each)
  for (const [sub, bucket] of bySub.entries()) {
    if (result.length >= desiredCount) break;
    if (usedSubs.has(sub)) continue;
    if (bucket.length) {
      result.push(bucket.shift()!);
      usedSubs.add(sub);
    }
  }

  // 4. Stage 3: fallback—best of the rest
  if (result.length < desiredCount) {
    const leftovers = Array.from(bySub.values())
      .flat()
      .sort((a, b) => b.metadata.score - a.metadata.score);
    for (const post of leftovers) {
      if (result.length >= desiredCount) break;
      result.push(post);
    }
  }

  return result;
}

function selectComments(
  all: CommentDoc[],
  topSubNames: string[],
  desiredCount = 8
): CommentDoc[] {
  const results = Array.from(
    new Map(
      all
        .filter(
          (d): d is CommentDoc =>
            d.type === "comment" && topSubNames.includes(d.metadata.subreddit)
        )
        .filter(isHighSignalComment)
        .map((c) => [(c.metadata as CommentDoc["metadata"]).subreddit, c])
    ).values()
  ).slice(0, desiredCount); // High signal FROM DIFFERENT SUBREDDITS comments desiredCount only (lower if not enough subreddits)

  if (results.length < desiredCount) {
    const used = new Set(results.map((p) => p.id));
    const additionalComments = all
      .filter(
        (d): d is CommentDoc =>
          d.type === "comment" && !used.has(d.id) && isHighSignalComment(d)
      )
      .sort((a, b) => b.metadata.score - a.metadata.score)
      .slice(0, 8 - results.length); // Fill in with high signal comments from any subreddit

    results.push(...additionalComments);
  }

  return results;
}

function isHighSignalComment(c: CommentDoc): boolean {
  const text = c.text.trim();
  if (GENERIC_RE.test(text)) return false; // 0. explicit filler

  const tokens = text.split(/\W+/).filter(Boolean); // 1. raw tokens
  if (tokens.length < 8) return false; // 2. too short

  const unique = new Set(tokens.map((t) => t.toLowerCase()));
  if (unique.size < 5) return false; // 3. low variety

  const lower = tokens.map((t) => t.toLowerCase());
  const content = lower.filter((w) => !STOPWORDS.has(w));
  if (content.length / tokens.length < 0.55) return false; // 4. lexical density

  const hasPronoun = lower.some((w) => PRONOUNS.has(w));

  // a noun-candidate = capitalised token OR ≥5 letters & not a stop-word/pronoun
  const hasNoun = tokens.some(
    (t) =>
      /[A-Z][a-z]+/.test(t) ||
      (t.length > 4 &&
        !STOPWORDS.has(t.toLowerCase()) &&
        !PRONOUNS.has(t.toLowerCase()))
  );

  if (!hasPronoun || !hasNoun) return false; // 5. need both

  // optional karma floor if you track it
  if ("score" in c.metadata && c.metadata.score < 2) return false;

  return true;
}

export async function selectDocs(all: Doc[]) {
  const subscriptionDocs = all
    .filter((d): d is SubscriptionDoc => d.type === "subscription")
    .sort(
      (a, b) =>
        b.metadata.personalKarma - a.metadata.personalKarma ||
        b.metadata.subscribers - a.metadata.subscribers
    )
    .slice(0, 10); // High signal most engaged/most popular subreddits 10 only

  const topSubNames = subscriptionDocs.map((d) => d.text);

  const profileDocs = all.find((d) => d.type === "profile");

  const postDocs = selectPosts(
    all.filter((d): d is PostDoc => d.type === "post" && !d.metadata.over_18),
    topSubNames,
    8
  ); // High signal FROM DIFFERENT SUBREDDITS

  const commentDocs = selectComments(
    all.filter(
      (d): d is CommentDoc => d.type === "comment" && !d.metadata.over_18
    ),
    topSubNames,
    8
  ); // High signal if possible

  const truncate = (d: Doc) => ({
    ...d,
    text: d.text.length > 400 ? d.text.slice(0, 400) + "..." : d.text,
  });

  console.log("Selected docs:", {
    profileDocs,
    postDocs: postDocs,
    commentDocs: commentDocs,
    subscriptionDocs: subscriptionDocs,
  });

  return [
    profileDocs,
    ...postDocs.map(truncate),
    ...commentDocs.map(truncate),
    ...subscriptionDocs.map(truncate),
  ].filter((d): d is Doc => d !== undefined);
}

export async function summarizeRedditData(docs: Doc[]): Promise<string> {
  try {
    const text = docsToText(docs);

    const USER_PROMPT =
      `Write ONE ${LIMIT_SETTINGS.summaryTokenLimit}-token bio that summarises ` +
      `the user's activity and background.`;

    if (!OPENAI_ACTIVE) {
      console.warn("OpenAI API is disabled. Cannot summarize Reddit data.");
      return "OpenAI API is disabled. Cannot summarize Reddit data.";
    }

    const completion = await openai.chat.completions.create({
      model: MODELS.SUMMARY,
      max_completion_tokens: LIMIT_SETTINGS.summaryTokenLimit + 20,
      messages: [
        {
          role: "system",
          content: SYS_PROMPT,
        },
        {
          role: "user",
          content: `${text}\n\n${USER_PROMPT}`,
        },
      ],
    });

    return completion.choices[0].message?.content?.trim() ?? "";
  } catch (error) {
    console.error("Error summarizing Reddit data:", error);
    return "Error summarizing Reddit data.";
  }
}

export async function embedSummary(summary: string): Promise<number[]> {
  try {
    if (!OPENAI_ACTIVE) {
      console.warn("OpenAI API is disabled. Cannot embed Reddit data.");
      return Array(1536).fill(0); // Return a zero vector
    }

    const embedding = await openai.embeddings.create({
      model: MODELS.EMBEDDING,
      input: summary,
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
      over_18: user.over_18,
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
      over_18: c.over_18,
    },
  }));

  const subscriptionDocs: SubscriptionDoc[] = data.subscrList.map((s) => {
    const k = data.karmaList?.find(
      (k) => k.sr === s.display_name_prefixed.slice(2)
    ); // Remove the "r/" prefix
    const personalKarma = k ? k.comment_karma + k.link_karma : 0;

    return {
      id: s.id,
      type: "subscription",
      text: s.display_name_prefixed,
      metadata: {
        subscribers: s.subscribers,
        over_18: s.over_18,
        personalKarma: personalKarma,
      },
    };
  });

  const docs: Doc[] = [
    profileDoc,
    ...postDocs,
    ...commentDocs,
    ...subscriptionDocs,
  ];

  return docs;
}
