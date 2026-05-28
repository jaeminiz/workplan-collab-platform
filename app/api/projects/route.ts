import { NextResponse } from "next/server";

import { listProjects } from "@/features/projects/repository";

export function GET() {
  return NextResponse.json({
    data: listProjects()
  });
}
