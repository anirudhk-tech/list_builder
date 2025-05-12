import { supabase } from "@/config";
import { User } from "@/types/supabase";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secureCookie: true,
  });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("reddit_username", token.name)
    .single();

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const response: User = {
    reddit_username: data.reddit_username,
    updated_at: data.updated_at,
    avatar_url: data.avatar_url,
    summary: data.summary,
  };

  return NextResponse.json<User>(response);
}
