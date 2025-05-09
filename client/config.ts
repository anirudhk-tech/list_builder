import { z } from "zod";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const env = z
  .object({
    NEXTAUTH_SECRET: z.string().nonempty(),
    OPENAI_API_KEY: z.string().nonempty(),
    GEMINI_API_KEY: z.string().nonempty(),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SECRET_KEY: z.string().nonempty(),
    EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
    SUMMARY_MODEL: z.string().default("gpt-3.5-turbo"),
    SUMMARY_TOKEN_LIMIT: z.number().default(100),
    QUERY_TOKEN_LIMIT: z.number().default(100),
    OPENAI_ACTIVE: z.string(),
    GEMINI_ACTIVE: z.string(),
    EXPLANATION_MODEL: z.string().default("gemini-1.5-flash"),
    EXPLANATION_TOKEN_LIMIT: z.number().default(100),
  })
  .parse(process.env);

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});
export const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

export const MODELS = {
  EMBEDDING: env.EMBEDDING_MODEL,
  SUMMARY: env.SUMMARY_MODEL,
};
export const LIMIT_SETTINGS = {
  summaryTokenLimit: env.SUMMARY_TOKEN_LIMIT,
  queryTokenLimit: env.QUERY_TOKEN_LIMIT,
  explanationTokenLimit: env.EXPLANATION_TOKEN_LIMIT,
};

export const OPENAI_ACTIVE = env.OPENAI_ACTIVE === "true";
export const GEMINI_ACTIVE = env.GEMINI_ACTIVE === "true";
