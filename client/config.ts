import { z } from "zod";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

const env = z
  .object({
    NEXTAUTH_SECRET: z.string().nonempty(),
    OPENAI_API_KEY: z.string().nonempty(),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SECRET_KEY: z.string().nonempty(),
    EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
    SUMMARY_MODEL: z.string().default("gpt-3.5-turbo"),
    SUMMARY_TOKEN_LIMIT: z.number().default(100),
    OPENAI_ACTIVE: z.string(),
  })
  .parse(process.env);

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

export const MODELS = {
  EMBEDDING: env.EMBEDDING_MODEL,
  SUMMARY: env.SUMMARY_MODEL,
};
export const SUMMARY_SETTINGS = {
  tokenLimit: env.SUMMARY_TOKEN_LIMIT,
};

export const OPENAI_ACTIVE = env.OPENAI_ACTIVE === "true";
