import { NextResponse } from "next/server";

import { listTaskFilesFromSupabase, uploadTaskFileToSupabase } from "@/features/tasks/supabase-files";

type TaskFilesRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: TaskFilesRouteContext) {
  const { id } = await context.params;
  const files = await listTaskFilesFromSupabase(id);

  return NextResponse.json({
    data: files ?? [],
    source: files ? "supabase" : "mock"
  });
}

export async function POST(request: Request, context: TaskFilesRouteContext) {
  const { id } = await context.params;
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        error: "File is required"
      },
      { status: 400 }
    );
  }

  try {
    const uploadedFile = await uploadTaskFileToSupabase(id, file);

    if (uploadedFile) {
      return NextResponse.json(
        {
          mode: "supabase",
          data: uploadedFile,
          message: "첨부파일이 Supabase Storage에 저장되었습니다."
        },
        { status: 201 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "File upload failed",
        message: "첨부파일 저장에 실패했습니다. Storage bucket과 DB 권한을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      mode: "poc-dry-run",
      data: {
        id: "new-file-preview",
        title: file.name,
        mimeType: file.type || null,
        sizeBytes: file.size,
        uploadedBy: "로그인 전 사용자",
        createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        downloadUrl: "#"
      },
      message: "로그인 전이므로 파일은 저장하지 않고 업로드 흐름만 검증했습니다."
    },
    { status: 201 }
  );
}
