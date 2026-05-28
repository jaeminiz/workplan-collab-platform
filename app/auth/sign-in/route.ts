import { NextResponse } from "next/server";

import { googleOAuthScopes } from "@/lib/auth/google";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const origin = new URL(request.url).origin;

  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=supabase_not_configured`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: googleOAuthScopes.join(" "),
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/login?error=google_oauth_unavailable`);
  }

  return NextResponse.redirect(data.url);
}
