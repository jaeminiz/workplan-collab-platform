import { AlertTriangle, CheckCircle2, Clock, MessageSquareText } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inboxItems, taskSummaries } from "@/features/projects/mock-data";

export default function DashboardPage() {
  const delayedTasks = taskSummaries.filter((task) => task.isDelayed);
  const pendingTasks = taskSummaries.filter((task) => task.status !== "완료확인");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">개인 대시보드</h1>
        <p className="mt-2 text-sm text-stone-500">
          전체 게시판을 한 번에 불러오지 않고, 오늘 처리해야 하는 업무와 알림만 먼저 보여줍니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="내 미완료 업무" value={String(pendingTasks.length)} description="상태 확인 필요" icon={Clock} />
        <MetricCard title="지연 업무" value={String(delayedTasks.length)} description="납기 초과 또는 위험" icon={AlertTriangle} />
        <MetricCard title="확인 요청" value="2" description="완료/검토 승인 대기" icon={CheckCircle2} />
        <MetricCard title="최근 멘션" value={String(inboxItems.length)} description="읽음과 완료를 분리" icon={MessageSquareText} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>오늘 우선순위</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {taskSummaries.map((task) => (
            <div key={task.id} className="flex flex-col gap-2 rounded-md border border-stone-200 p-3 hover:bg-stone-50 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-stone-950">{task.title}</p>
                <p className="text-sm text-stone-500">
                  {task.projectCode} · {task.customer} · {task.assignee}
                </p>
              </div>
              <p className="text-sm font-medium text-stone-700">{task.dueDate}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
