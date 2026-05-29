"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

type TaskRestoreButtonProps = {
  taskId: string;
};

async function restoreTask(taskId: string) {
  const response = await fetch(`/api/tasks/${taskId}/restore`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("업무 복구에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskRestoreButton({ taskId }: TaskRestoreButtonProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => restoreTask(taskId),
    onSuccess: () => router.refresh()
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <RotateCcw className="h-4 w-4" />
      {mutation.isPending ? "복구 중" : "복구"}
    </Button>
  );
}
