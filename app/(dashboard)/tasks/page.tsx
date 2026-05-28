import { KanbanPreview } from "@/components/task/kanban-preview";
import { taskSummaries } from "@/features/projects/mock-data";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">업무 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          Workplan의 업무명을 구조화 필드로 분리하고, 상태와 흐름을 칸반으로 확인합니다.
        </p>
      </div>
      <KanbanPreview tasks={taskSummaries} />
    </div>
  );
}
