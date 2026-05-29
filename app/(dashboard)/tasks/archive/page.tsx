import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, Archive } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskRestoreButton } from "@/components/task/task-restore-button";
import { listArchivedTasksFromSupabase } from "@/features/projects/supabase-repository";

export default async function TaskArchivePage() {
  const tasks = await listArchivedTasksFromSupabase();

  return (
    <div className="space-y-6">
      <Link href="/tasks" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950">
        <ArrowLeft className="h-4 w-4" />
        업무 관리
      </Link>

      <div>
        <h1 className="text-3xl font-semibold text-stone-950">보관 업무</h1>
        <p className="mt-2 text-sm text-stone-500">
          목록과 검색에서 제외된 업무를 확인하고 필요한 경우 다시 복구합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>보관 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!tasks ? (
            <div className="p-4 text-sm text-stone-500">
              로그인 후 Supabase DB에 연결되면 보관된 업무가 표시됩니다.
            </div>
          ) : null}
          {tasks?.length === 0 ? (
            <div className="p-4 text-sm text-stone-500">보관된 업무가 없습니다.</div>
          ) : null}
          <div className="divide-y divide-stone-100">
            {tasks?.map((task) => (
              <div key={task.id} className="grid gap-3 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-600">
                      <Archive className="h-4 w-4" />
                    </span>
                    <Badge variant="secondary">{task.status}</Badge>
                    <Link href={`/tasks/${task.id}` as Route} className="truncate font-medium text-stone-900 hover:underline">
                      {task.title}
                    </Link>
                  </div>
                  <p className="mt-1 truncate text-sm text-stone-500">
                    {task.projectCode} · {task.customer} · 보관 {task.archivedAt}
                  </p>
                </div>
                <TaskRestoreButton taskId={task.id} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
