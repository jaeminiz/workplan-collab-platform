"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { taskTypes } from "@/features/tasks/constants";
import type { TaskSummary, TaskType } from "@/types/domain";

type TaskMetadataEditorProps = {
  task: Pick<TaskSummary, "id" | "title" | "type" | "dueDate">;
};

async function updateTaskMetadata(
  taskId: string,
  input: { title: string; type: TaskType; dueDate: string }
) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("업무 기본 정보 저장에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskMetadataEditor({ task }: TaskMetadataEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [type, setType] = useState<TaskType>(task.type);
  const [dueDate, setDueDate] = useState(task.dueDate === "-" ? "" : task.dueDate);

  const mutation = useMutation({
    mutationFn: () => updateTaskMetadata(task.id, { title, type, dueDate }),
    onSuccess: () => router.refresh()
  });

  const canSubmit = title.trim().length >= 2 && /^\d{4}-\d{2}-\d{2}$/.test(dueDate);

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">기본 정보</h2>
      </div>
      <div className="grid gap-3 p-4 lg:grid-cols-[1fr_160px_160px_auto] lg:items-end">
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">업무명</span>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">유형</span>
          <select
            className="h-9 w-full rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            value={type}
            onChange={(event) => setType(event.target.value as TaskType)}
          >
            {taskTypes.map((taskType) => (
              <option key={taskType} value={taskType}>
                {taskType}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">납기</span>
          <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
        <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending || !canSubmit}>
          {mutation.isPending ? "저장 중" : "기본 정보 저장"}
        </Button>
      </div>
      <p className="border-t border-stone-100 px-4 py-3 text-sm text-stone-500">
        {mutation.isSuccess ? mutation.data.message : "업무명, 유형, 납기는 검색과 일정 기준으로 사용됩니다."}
        {mutation.isError ? " 기본 정보 저장 요청에 실패했습니다." : null}
      </p>
    </section>
  );
}
