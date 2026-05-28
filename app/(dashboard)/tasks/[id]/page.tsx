import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, MessageSquare, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { findProjectByCode } from "@/features/projects/repository";
import { getTaskById } from "@/features/tasks/repository";
import { findProjectByCodeFromSupabase, getTaskByIdFromSupabase } from "@/features/projects/supabase-repository";

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

      <section className="rounded-md border border-stone-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-stone-900">POC 상세 정보</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          이 화면은 기존 Workplan의 게시판형 업무를 대체하기 위한 상세 화면 초안입니다. 다음 단계에서 댓글,
          첨부파일, 상태 변경, 담당자 변경, 이력 로그를 실제 데이터와 연결합니다.
        </p>
      </section>
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
