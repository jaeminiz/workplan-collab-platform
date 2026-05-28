import Link from "next/link";
import type { Route } from "next";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ProjectSummary } from "@/types/domain";

const healthVariant = {
  정상: "default",
  주의: "warning",
  지연: "destructive"
} as const;

export function ProjectTable({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-stone-200 bg-white">
      <div className="grid grid-cols-[1.1fr_1fr_120px_110px_100px] gap-4 border-b border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-medium text-stone-500 max-lg:hidden">
        <span>프로젝트</span>
        <span>고객/호선</span>
        <span>진행률</span>
        <span>상태</span>
        <span>납기</span>
      </div>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}` as Route}
          className="grid gap-3 border-b border-stone-100 px-4 py-3 last:border-b-0 hover:bg-stone-50/70 lg:grid-cols-[1.1fr_1fr_120px_110px_100px] lg:items-center lg:gap-4"
        >
          <div>
            <p className="font-medium text-stone-900">{project.name}</p>
            <p className="text-sm text-stone-500">{project.code}</p>
          </div>
          <div className="text-sm text-stone-700">
            <p>{project.customer}</p>
            <p className="text-stone-500">{project.vessel || "-"}</p>
          </div>
          <div>
            <Progress value={project.progress} />
            <p className="mt-1 text-xs text-stone-500">{project.progress}%</p>
          </div>
          <Badge variant={healthVariant[project.health]}>{project.health}</Badge>
          <p className="text-sm font-medium text-stone-700">{project.dueDate}</p>
        </Link>
      ))}
    </div>
  );
}
