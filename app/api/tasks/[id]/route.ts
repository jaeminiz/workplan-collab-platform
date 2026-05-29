import { NextResponse } from "next/server";

import {
  archiveTaskInSupabase,
  updateTaskBodyInSupabase,
  updateTaskMetadataInSupabase,
  updateTaskStatusInSupabase
} from "@/features/tasks/supabase-mutations";
import { updateTaskSchema } from "@/features/tasks/validators";

type TaskRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: TaskRouteContext) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsedPayload = updateTaskSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: "Invalid task payload",
        issues: parsedPayload.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  try {
    if (parsedPayload.data.status) {
      const updatedTask = await updateTaskStatusInSupabase(id, { status: parsedPayload.data.status });

      if (updatedTask) {
        return NextResponse.json({
          mode: "supabase",
          data: updatedTask,
          message: "업무 상태가 Supabase에 저장되었습니다."
        });
      }
    }

    if (parsedPayload.data.body) {
      const updatedTask = await updateTaskBodyInSupabase(id, { body: parsedPayload.data.body });

      if (updatedTask) {
        return NextResponse.json({
          mode: "supabase",
          data: updatedTask,
          message: "업무 내용이 Supabase에 저장되었습니다."
        });
      }
    }

    if (parsedPayload.data.title || parsedPayload.data.type || parsedPayload.data.dueDate) {
      const updatedTask = await updateTaskMetadataInSupabase(id, {
        title: parsedPayload.data.title,
        type: parsedPayload.data.type,
        dueDate: parsedPayload.data.dueDate
      });

      if (updatedTask) {
        return NextResponse.json({
          mode: "supabase",
          data: updatedTask,
          message: "업무 기본 정보가 Supabase에 저장되었습니다."
        });
      }
    }
  } catch {
    return NextResponse.json(
      {
        error: "Task update failed",
        message: "업무 저장에 실패했습니다. DB 권한과 로그인 세션을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    mode: "poc-dry-run",
    data: {
      id,
      ...parsedPayload.data
    },
    message: parsedPayload.data.body
      ? "로그인 전이므로 업무 내용은 저장하지 않고 입력 흐름만 검증했습니다."
      : parsedPayload.data.title || parsedPayload.data.type || parsedPayload.data.dueDate
        ? "로그인 전이므로 업무 기본 정보는 저장하지 않고 입력 흐름만 검증했습니다."
        : "로그인 전이므로 상태 변경은 화면 검증만 수행했습니다."
  });
}

export async function DELETE(_request: Request, context: TaskRouteContext) {
  const { id } = await context.params;

  try {
    const archivedTask = await archiveTaskInSupabase(id);

    if (archivedTask) {
      return NextResponse.json({
        mode: "supabase",
        data: archivedTask,
        message: "업무가 보관 처리되었습니다."
      });
    }
  } catch {
    return NextResponse.json(
      {
        error: "Task archive failed",
        message: "업무 보관에 실패했습니다. DB 권한과 로그인 세션을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    mode: "poc-dry-run",
    data: {
      id,
      archivedAt: new Date().toISOString()
    },
    message: "로그인 전이므로 업무는 보관하지 않고 흐름만 검증했습니다."
  });
}
