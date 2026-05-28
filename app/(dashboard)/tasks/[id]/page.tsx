import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, MessageSquare, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TaskBodyEditor } from "@/components/task/task-body-editor";
import { TaskCommentPanel } from "@/components/task/task-comment-panel";
import { TaskStatusControl } from "@/components/task/task-status-control";
import { findProjectByCode } from "@/features/projects/repository";
import { getTaskById } from "@/features/tasks/repository";
import { findProjectByCodeFromSupabase, getTaskByIdFromSupabase } from "@/features/projects/supabase-repository";
import { listMockTaskActivities, listMockTaskComments } from "@/features/tasks/comments";
import { listTaskCommentsFromSupabase } from "@/features/tasks/supabase-comments";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = (await getTaskByIdFromSupabase(id)) ?? getTaskById(id);

  if (!task) {
    notFound();
  }

  const project = (await findProjectByCodeFromSupabase(task.projectCode)) ?? findProjectByCode(task.projectCode);
  const comments = (await listTaskCommentsFromSupabase(task.id)) ?? listMockTaskComments(task.id);
  const activities = listMockTaskActivities(task.id);

  return (
    <div className="space-y-6">
      <Link href="/tasks" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950">
        <ArrowLeft className="h-4 w-4" />
        업무 목록
      </Link>

      <section className="rounded-md border border-stone-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant={task.isDelayed ? "destructive" : "outline"}>{task.status}</Badge>
          <Badge variant="secondary">{task.type}</Badge>
          <span className="text-sm text-stone-500">{task.projectCode}</span>
        </div>
        <h1 className="text-3xl font-semibold text-stone-950">{task.title}</h1>
        <p className="mt-2 text-sm text-stone-500">
          {task.customer} · {project?.name ?? "프로젝트 정보 확인 필요"}
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Info icon={UserRound} label="담당" value={task.assignee} />
        <Info icon={CalendarDays} label="납기" value={task.dueDate} />
        <Info icon={MessageSquare} label="댓글" value={`${task.comments}건`} />
        <Info icon={FileText} label="첨부" value={`${task.files}건`} />
      </div>

      <TaskBodyEditor taskId={task.id} initialBody={task.body} />

      <section className="rounded-md border border-stone-200 bg-white">
        <div className="border-b border-stone-100 p-4">
          <h2 className="text-sm font-semibold text-stone-900">업무 처리 흐름</h2>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-5">
          {["접수", "검토", "진행", "확인 요청", "완료"].map((step, index) => (
            <div key={step} className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-medium text-stone-500">STEP {index + 1}</p>
              <p className="mt-1 font-semibold text-stone-900">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <TaskStatusControl taskId={task.id} currentStatus={task.status} />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <TaskCommentPanel taskId={task.id} comments={comments} />

        <section className="rounded-md border border-stone-200 bg-white">
          <div className="border-b border-stone-100 p-4">
            <h2 className="text-sm font-semibold text-stone-900">활동 로그</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4">
                <p className="text-sm font-medium text-stone-900">{activity.title}</p>
                <p className="mt-1 text-xs text-stone-500">{activity.createdAt}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-stone-100 text-stone-700">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-stone-950">{value}</p>
    </div>
  );
}
