import { NextResponse } from "next/server";
import { z } from "zod";

import { searchWorkspace, searchWorkspaceFromSupabase } from "@/features/search/repository";

const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedQuery = searchQuerySchema.safeParse({
    q: searchParams.get("q") ?? ""
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        error: "Search query is required",
        issues: parsedQuery.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const supabaseResults = await searchWorkspaceFromSupabase(parsedQuery.data.q);

  return NextResponse.json({
    data: supabaseResults ?? searchWorkspace(parsedQuery.data.q),
    source: supabaseResults ? "supabase" : "mock"
  });
}
