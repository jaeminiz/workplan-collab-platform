import { ProjectTable } from "@/components/project/project-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectSummaries } from "@/features/projects/mock-data";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">프로젝트</h1>
        <p className="mt-2 text-sm text-stone-500">
          프로젝트별 진행률, 지연 업무, 고객/호선 정보를 구조화해서 표시합니다.
        </p>
      </div>
      <ProjectTable projects={projectSummaries} />
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 화면 탭 구성</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-stone-600 md:grid-cols-3">
          {["리스트", "칸반", "간트/타임라인", "캘린더", "파일", "활동 로그"].map((tab) => (
            <div key={tab} className="rounded-md border border-stone-200 bg-stone-50 p-3 font-medium">
              {tab}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
