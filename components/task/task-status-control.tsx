"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { taskStatuses } from "@/features/tasks/constants";
import type { TaskStatus } from "@/types/domain";

type TaskStatusControlProps = {
  taskId: string;
  currentStatus: TaskStatus;
};

async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error("업무 상태 변경에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskStatusControl({ taskId, currentStatus }: TaskStatusControlProps) {
  const router = useRouter();
  const [status, setStatus] = useState<TaskStatus>(currentStatus);

  const mutation = useMutation({
    mutationFn: () => updateTaskStatus(taskId, status),
    onSuccess: () => router.refresh()
  });

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">상태 변경</h2>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">현재 상태</span>
          <select
            className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
          >
            {taskStatuses.map((taskStatus) => (
              <option key={taskStatus} value={taskStatus}>
                {taskStatus}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "저장 중" : "상태 저장"}
        </Button>
      </div>
      <p className="border-t border-stone-100 px-4 py-3 text-sm text-stone-500">
        {mutation.isSuccess ? mutation.data.message : "로그인 전에는 dry-run, 로그인 후에는 Supabase에 저장됩니다."}
        {mutation.isError ? " 상태 저장 요청에 실패했습니다." : null}
      </p>
    </section>
  );
}
