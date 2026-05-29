import { NextResponse } from "next/server";

import { ensureProfileForUser } from "@/features/auth/profiles";
import { isAllowedWorkspaceEmail } from "@/lib/auth/google";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=supabase_not_configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=session_exchange_failed`);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    return NextResponse.redirect(`${origin}/login?error=user_lookup_failed`);
  }

  if (!isAllowedWorkspaceEmail(userData.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=unauthorized_domain`);
  }

  try {
    await ensureProfileForUser(supabase, userData.user);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=profile_setup_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
