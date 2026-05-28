import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/client";

export function GET() {
  return NextResponse.json({
    ok: true,
    supabaseConfigured: hasSupabaseEnv,
    integrations: ["google-oauth", "gmail", "gemini", "slack", "telegram", "kakao", "mcp"]
  });
}
