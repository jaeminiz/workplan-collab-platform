"use client";

import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

type TaskArchiveControlProps = {
  taskId: string;
};

async function archiveTask(taskId: string) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("업무 보관에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskArchiveControl({ taskId }: TaskArchiveControlProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => archiveTask(taskId),
    onSuccess: () => router.push("/tasks")
  });

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">업무 보관</h2>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm text-stone-500">
          완료되었거나 중복 등록된 업무는 삭제하지 않고 목록과 검색에서 제외되도록 보관합니다.
          {mutation.isError ? " 업무 보관 요청에 실패했습니다." : null}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          <Archive className="h-4 w-4" />
          {mutation.isPending ? "보관 중" : "업무 보관"}
        </Button>
      </div>
    </section>
  );
}
