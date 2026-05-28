import { NextResponse } from "next/server";

import { updateTaskStatusInSupabase } from "@/features/tasks/supabase-mutations";
import { updateTaskStatusSchema } from "@/features/tasks/validators";

type TaskRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: TaskRouteContext) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsedPayload = updateTaskStatusSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: "Invalid task status payload",
        issues: parsedPayload.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  try {
    const updatedTask = await updateTaskStatusInSupabase(id, parsedPayload.data);

    if (updatedTask) {
      return NextResponse.json({
        mode: "supabase",
        data: updatedTask,
        message: "업무 상태가 Supabase에 저장되었습니다."
      });
    }
  } catch {
    return NextResponse.json(
      {
        error: "Task status update failed",
        message: "업무 상태 저장에 실패했습니다. DB 권한과 로그인 세션을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    mode: "poc-dry-run",
    data: {
      id,
      status: parsedPayload.data.status
    },
    message: "로그인 전이므로 상태 변경은 화면 검증만 수행했습니다."
  });
}
