import { NextResponse } from "next/server";
import { z } from "zod";

import { listTasks } from "@/features/tasks/repository";
import { taskStatuses, taskTypes } from "@/features/tasks/constants";
import { createTaskSchema } from "@/features/tasks/validators";

const taskQuerySchema = z.object({
  status: z.enum(taskStatuses).optional(),
  type: z.enum(taskTypes).optional(),
  assignee: z.string().min(1).optional()
});

export function GET(request: Request) {
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

  return NextResponse.json({
    data: listTasks(parsedQuery.data)
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
      message: "Task payload validated. Supabase persistence will be enabled after DB setup."
    },
    { status: 201 }
  );
}
