// app/api/profiles/upsert/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { supabase } from "@/config";
import type { UserUpsert } from "@/types/supabase";

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!token?.sub) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body: UserUpsert = await request.json();

  const { error } = await supabase
    .from("profiles")
    .upsert(body, { onConflict: "reddit_username" });

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
