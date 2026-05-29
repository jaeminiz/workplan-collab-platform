import { NextResponse } from "next/server";

import { restoreTaskInSupabase } from "@/features/tasks/supabase-mutations";

type TaskRestoreRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: TaskRestoreRouteContext) {
  const { id } = await context.params;

  try {
    const restoredTask = await restoreTaskInSupabase(id);

    if (restoredTask) {
      return NextResponse.json({
        mode: "supabase",
        data: restoredTask,
        message: "보관된 업무가 복구되었습니다."
      });
    }
  } catch {
    return NextResponse.json(
      {
        error: "Task restore failed",
        message: "업무 복구에 실패했습니다. DB 권한과 로그인 세션을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    mode: "poc-dry-run",
    data: {
      id,
      restoredAt: new Date().toISOString()
    },
    message: "로그인 전이므로 업무는 복구하지 않고 흐름만 검증했습니다."
  });
}
