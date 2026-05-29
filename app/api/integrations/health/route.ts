import { NextResponse } from "next/server";

import { getAllowedWorkspaceDomain, googleOAuthScopes } from "@/lib/auth/google";
import { hasSupabaseEnv } from "@/lib/supabase/client";

export function GET(request: Request) {
  const supabaseConfigured = hasSupabaseEnv();
  const workspaceDomain = getAllowedWorkspaceDomain();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  return NextResponse.json({
    ok: supabaseConfigured,
    supabaseConfigured,
    appUrl,
    googleOAuth: {
      workspaceDomain,
      scopes: googleOAuthScopes,
      configured: supabaseConfigured
    },
    requiredMigrations: [
      "0001_initial_schema.sql",
      "0002_auth_session_profiles.sql",
      "0003_storage_work_files.sql",
      "0004_task_archive.sql"
    ],
    integrations: ["google-oauth", "gmail", "gemini", "slack", "telegram", "kakao", "erp", "mcp"]
  });
}
