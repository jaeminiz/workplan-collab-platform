"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { taskStatuses, taskTypes } from "@/features/tasks/constants";
import type { CreateTaskInput } from "@/features/tasks/validators";

async function createTask(payload: CreateTaskInput) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("업무 생성 요청에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: string; message: string }>;
}

export function TaskCreateForm() {
  const [form, setForm] = useState<CreateTaskInput>({
    title: "",
    projectCode: "",
    customer: "",
    type: "일반업무",
    status: "미착수",
    assignee: "담당자 미정",
    dueDate: new Date().toISOString().slice(0, 10)
  });

  const mutation = useMutation({
    mutationFn: createTask
  });

  function updateForm<K extends keyof CreateTaskInput>(key: K, value: CreateTaskInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="rounded-md border border-stone-200 bg-white"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(form);
      }}
    >
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">업무 생성</h2>
        <p className="mt-1 text-sm text-stone-500">
          현재는 POC 검증용 dry-run입니다. Supabase 연결 후 실제 저장으로 전환합니다.
        </p>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-2">
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-medium text-stone-500">업무명</span>
          <Input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">프로젝트 코드</span>
          <Input value={form.projectCode} onChange={(event) => updateForm("projectCode", event.target.value)} required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">고객사</span>
          <Input value={form.customer} onChange={(event) => updateForm("customer", event.target.value)} required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">업무 유형</span>
          <select
            className="h-9 w-full rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            value={form.type}
            onChange={(event) => updateForm("type", event.target.value as CreateTaskInput["type"])}
          >
            {taskTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">상태</span>
          <select
            className="h-9 w-full rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            value={form.status}
            onChange={(event) => updateForm("status", event.target.value as CreateTaskInput["status"])}
          >
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">담당자</span>
          <Input value={form.assignee} onChange={(event) => updateForm("assignee", event.target.value)} required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">납기</span>
          <Input type="date" value={form.dueDate} onChange={(event) => updateForm("dueDate", event.target.value)} required />
        </label>
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 p-4">
        <p className="text-sm text-stone-500">
          {mutation.isSuccess ? "입력값 검증이 완료되었습니다." : "필수 정보를 입력해 dry-run으로 검증합니다."}
        </p>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "검증 중" : "업무 생성 검증"}
        </Button>
      </div>
    </form>
  );
}
