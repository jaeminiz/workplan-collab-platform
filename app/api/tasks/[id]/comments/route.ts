import { NextResponse } from "next/server";

import { createTaskCommentInSupabase } from "@/features/tasks/supabase-mutations";
import { createTaskCommentSchema } from "@/features/tasks/validators";

type TaskCommentsRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: TaskCommentsRouteContext) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsedPayload = createTaskCommentSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: "Invalid task comment payload",
        issues: parsedPayload.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  try {
    const comment = await createTaskCommentInSupabase(id, parsedPayload.data);

    if (comment) {
      return NextResponse.json(
        {
          mode: "supabase",
          data: comment,
          message: "댓글이 Supabase에 저장되었습니다."
        },
        { status: 201 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "Task comment insert failed",
        message: "댓글 저장에 실패했습니다. DB 권한과 로그인 세션을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      mode: "poc-dry-run",
      data: {
        id: "comment-preview",
        author: "익명 사용자",
        body: parsedPayload.data.body,
        createdAt: new Date().toISOString().slice(0, 16).replace("T", " ")
      },
      message: "로그인 전이므로 댓글은 저장하지 않고 입력 흐름만 검증했습니다."
    },
    { status: 201 }
  );
}
