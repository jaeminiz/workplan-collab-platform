"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { TaskComment } from "@/features/tasks/comments";

type TaskCommentPanelProps = {
  taskId: string;
  comments: TaskComment[];
};

async function createComment(taskId: string, body: string) {
  const response = await fetch(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ body })
  });

  if (!response.ok) {
    throw new Error("댓글 저장에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskCommentPanel({ taskId, comments }: TaskCommentPanelProps) {
  const router = useRouter();
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: () => createComment(taskId, body),
    onSuccess: () => {
      setBody("");
      router.refresh();
    }
  });

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">댓글</h2>
      </div>
      <div className="space-y-3 p-4">
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="진행 상황, 검토 요청, 이슈 내용을 남깁니다."
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            {mutation.isSuccess ? mutation.data.message : "댓글은 업무 이력과 함께 추적됩니다."}
            {mutation.isError ? " 댓글 저장 요청에 실패했습니다." : null}
          </p>
          <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending || body.trim().length < 2}>
            {mutation.isPending ? "저장 중" : "댓글 저장"}
          </Button>
        </div>
      </div>
      <div className="divide-y divide-stone-100 border-t border-stone-100">
        {comments.map((comment) => (
          <article key={comment.id} className="p-4">
            <div className="mb-1 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-stone-900">{comment.author}</p>
              <p className="text-xs text-stone-500">{comment.createdAt}</p>
            </div>
            <p className="text-sm leading-6 text-stone-600">{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
