import { NextResponse } from "next/server";

import { listProjects } from "@/features/projects/repository";
import { listProjectsFromSupabase } from "@/features/projects/supabase-repository";

export async function GET() {
  const supabaseProjects = await listProjectsFromSupabase();

  return NextResponse.json({
    data: supabaseProjects ?? listProjects(),
    source: supabaseProjects ? "supabase" : "mock"
  });
}
