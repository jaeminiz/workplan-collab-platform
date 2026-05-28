import { NextResponse } from "next/server";
import { z } from "zod";

import { searchWorkspace } from "@/features/search/repository";

const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100)
});

export function GET(request: Request) {
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

  return NextResponse.json({
    data: searchWorkspace(parsedQuery.data.q)
  });
}
