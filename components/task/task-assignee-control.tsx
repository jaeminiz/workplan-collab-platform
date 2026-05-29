"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import type { ProfileOption } from "@/features/auth/profiles";

type TaskAssigneeControlProps = {
  taskId: string;
  currentAssigneeId?: string;
  profiles: ProfileOption[];
};

async function updateTaskAssignee(taskId: string, assigneeId: string | null) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ assigneeId })
  });

  if (!response.ok) {
    throw new Error("담당자 저장에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskAssigneeControl({
  taskId,
  currentAssigneeId,
  profiles
}: TaskAssigneeControlProps) {
  const router = useRouter();
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId ?? "");

  const mutation = useMutation({
    mutationFn: () => updateTaskAssignee(taskId, assigneeId || null),
    onSuccess: () => router.refresh()
  });

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">담당자 배정</h2>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-500">담당자</span>
          <select
            className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            disabled={profiles.length === 0}
          >
            <option value="">담당자 미지정</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.displayName} · {profile.email}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || profiles.length === 0}
        >
          <UserRound className="h-4 w-4" />
          {mutation.isPending ? "저장 중" : "담당자 저장"}
        </Button>
      </div>
      <p className="border-t border-stone-100 px-4 py-3 text-sm text-stone-500">
        {profiles.length === 0
          ? "로그인 후 프로필 목록이 준비되면 담당자를 배정할 수 있습니다."
          : mutation.isSuccess
            ? mutation.data.message
            : "담당자는 업무 목록, 칸반, 검색 필터의 기준으로 사용됩니다."}
        {mutation.isError ? " 담당자 저장 요청에 실패했습니다." : null}
      </p>
    </section>
  );
}
