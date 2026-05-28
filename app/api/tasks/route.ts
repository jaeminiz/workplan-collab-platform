import { NextResponse } from "next/server";
import { z } from "zod";

import { listTasksFromSupabase } from "@/features/projects/supabase-repository";
import { listTasks } from "@/features/tasks/repository";
import { createTaskInSupabase } from "@/features/tasks/supabase-mutations";
import { taskStatuses, taskTypes } from "@/features/tasks/constants";
import { createTaskSchema } from "@/features/tasks/validators";

const taskQuerySchema = z.object({
  status: z.enum(taskStatuses).optional(),
  type: z.enum(taskTypes).optional(),
  assignee: z.string().min(1).optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedQuery = taskQuerySchema.safeParse({
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
    assignee: searchParams.get("assignee") || undefined
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        error: "Invalid task query",
        issues: parsedQuery.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const supabaseTasks = await listTasksFromSupabase();
  const tasks = supabaseTasks ?? listTasks(parsedQuery.data);

  return NextResponse.json({
    data: tasks,
    source: supabaseTasks ? "supabase" : "mock"
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsedPayload = createTaskSchema.safeParse(payload);

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
    const task = await createTaskInSupabase(parsedPayload.data);

    if (task) {
      return NextResponse.json(
        {
          mode: "supabase",
          data: task,
          message: "업무가 Supabase에 저장되었습니다."
        },
        { status: 201 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "Task insert failed",
        message: "Supabase 업무 저장에 실패했습니다. DB 권한과 Google 로그인 세션을 확인하세요."
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      mode: "poc-dry-run",
      data: {
        id: "new-task-preview",
        ...parsedPayload.data,
        comments: 0,
        files: 0,
        isDelayed: false
      },
      message: "로그인 전이므로 저장하지 않고 입력값만 검증했습니다."
    },
    { status: 201 }
  );
}
