import { NextResponse } from "next/server";

import { createTaskFileDownloadUrl } from "@/features/tasks/supabase-files";

type TaskFileDownloadRouteContext = {
  params: Promise<{ id: string; fileId: string }>;
};

export async function GET(_request: Request, context: TaskFileDownloadRouteContext) {
  const { id, fileId } = await context.params;
  const signedUrl = await createTaskFileDownloadUrl(id, fileId);

  if (!signedUrl) {
    return NextResponse.json(
      {
        error: "File not found"
      },
      { status: 404 }
    );
  }

  return NextResponse.redirect(signedUrl);
}
