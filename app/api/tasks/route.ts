import { NextResponse } from "next/server";
import { z } from "zod";

import { listTasks } from "@/features/tasks/repository";
import { taskStatuses, taskTypes } from "@/features/tasks/constants";

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
