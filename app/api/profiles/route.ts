import { NextResponse } from "next/server";

import { listProfilesFromSupabase } from "@/features/auth/profiles";

export async function GET() {
  const profiles = await listProfilesFromSupabase();

  return NextResponse.json({
    data: profiles ?? [],
    source: profiles ? "supabase" : "mock"
  });
}
