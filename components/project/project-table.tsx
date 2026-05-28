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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="grid grid-cols-[1.1fr_1fr_120px_110px_100px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500 max-lg:hidden">
        <span>프로젝트</span>
        <span>고객/호선</span>
        <span>진행률</span>
        <span>상태</span>
        <span>납기</span>
      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 lg:grid-cols-[1.1fr_1fr_120px_110px_100px] lg:items-center lg:gap-4"
        >
          <div>
            <p className="font-bold text-slate-950">{project.name}</p>
            <p className="text-sm text-slate-500">{project.code}</p>
          </div>
          <div className="text-sm text-slate-700">
            <p>{project.customer}</p>
            <p className="text-slate-500">{project.vessel || "-"}</p>
          </div>
          <div>
            <Progress value={project.progress} />
            <p className="mt-1 text-xs text-slate-500">{project.progress}%</p>
          </div>
          <Badge variant={healthVariant[project.health]}>{project.health}</Badge>
          <p className="text-sm font-semibold text-slate-700">{project.dueDate}</p>
        </div>
      ))}
    </div>
  );
}
