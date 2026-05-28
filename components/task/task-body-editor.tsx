"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type TaskBodyEditorProps = {
  taskId: string;
  initialBody?: string;
};

async function updateTaskBody(taskId: string, body: string) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ body })
  });

  if (!response.ok) {
    throw new Error("업무 내용 저장에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskBodyEditor({ taskId, initialBody }: TaskBodyEditorProps) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody ?? "");

  const mutation = useMutation({
    mutationFn: () => updateTaskBody(taskId, body),
    onSuccess: () => router.refresh()
  });

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">업무 내용</h2>
      </div>
      <div className="space-y-3 p-4">
        <Textarea
          className="min-h-48"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="기존 Workplan 게시판 본문처럼 업무 배경, 요청사항, 처리 이력, 참고 내용을 작성합니다."
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            {mutation.isSuccess ? mutation.data.message : "본문은 통합검색 대상이 되며 댓글과 별도로 관리됩니다."}
            {mutation.isError ? " 업무 내용 저장 요청에 실패했습니다." : null}
          </p>
          <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending || body.trim().length < 2}>
            {mutation.isPending ? "저장 중" : "내용 저장"}
          </Button>
        </div>
      </div>
    </section>
  );
}
