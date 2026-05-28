import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, FileText, MessageSquare, SquareKanban } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProjectById, listProjectTasks } from "@/features/projects/repository";
import { getProjectByIdFromSupabase, listTasksFromSupabase } from "@/features/projects/supabase-repository";

const healthVariant = {
  정상: "default",
  주의: "warning",
  지연: "destructive"
} as const;

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = (await getProjectByIdFromSupabase(id)) ?? getProjectById(id);

  if (!project) {
    notFound();
  }

  const supabaseTasks = await listTasksFromSupabase();
  const tasks = supabaseTasks?.filter((task) => task.projectCode === project.code) ?? listProjectTasks(project.code);
  const doneCount = tasks.filter((task) => task.status === "완료확인").length;

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950">
        <ArrowLeft className="h-4 w-4" />
        프로젝트 목록
      </Link>

      <section className="rounded-md border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant={healthVariant[project.health]}>{project.health}</Badge>
              <span className="text-sm text-stone-500">{project.code}</span>
            </div>
            <h1 className="text-3xl font-semibold text-stone-950">{project.name}</h1>
            <p className="mt-2 text-sm text-stone-500">
              {project.customer} · {project.vessel || "호선 미지정"} · 담당 {project.owner}
            </p>
          </div>
          <div className="w-full rounded-md border border-stone-200 bg-stone-50 p-3 md:w-64">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">진행률</span>
              <span className="font-semibold text-stone-900">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="mt-2" />
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Metric icon={Clock} label="미완료 업무" value={String(project.openTasks)} />
        <Metric icon={CheckCircle2} label="완료 업무" value={String(doneCount)} />
        <Metric icon={CalendarDays} label="납기" value={project.dueDate} />
        <Metric icon={SquareKanban} label="지연 업무" value={String(project.delayedTasks)} />
      </div>

      <section className="rounded-md border border-stone-200 bg-white">
        <div className="border-b border-stone-100 p-4">
          <h2 className="text-sm font-semibold text-stone-900">프로젝트 업무</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {tasks.length === 0 ? (
            <p className="p-4 text-sm text-stone-500">아직 연결된 업무가 없습니다.</p>
          ) : (
            tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}` as Route}
                className="grid gap-2 p-4 hover:bg-stone-50 md:grid-cols-[1fr_120px_100px]"
              >
                <div>
                  <p className="font-medium text-stone-900">{task.title}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {task.type} · {task.assignee} · 댓글 {task.comments} · 첨부 {task.files}
                  </p>
                </div>
                <Badge variant={task.isDelayed ? "destructive" : "outline"}>{task.status}</Badge>
                <span className="text-sm font-medium text-stone-700">{task.dueDate}</span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          ["칸반", "상태별 업무 흐름을 한눈에 확인"],
          ["간트/일정", "납기와 마일스톤 중심으로 지연 확인"],
          ["파일/활동", "첨부, 댓글, 변경 이력 추적"]
        ].map(([title, description]) => (
          <div key={title} className="rounded-md border border-stone-200 bg-white p-4">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-stone-100">
              {title === "파일/활동" ? <FileText className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            </div>
            <h3 className="font-semibold text-stone-900">{title}</h3>
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-stone-100 text-stone-700">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-stone-950">{value}</p>
    </div>
  );
}
