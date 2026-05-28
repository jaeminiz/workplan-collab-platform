import { Badge } from "@/components/ui/badge";
import { kanbanColumns } from "@/features/tasks/constants";
import type { TaskSummary } from "@/types/domain";

const columnTaskMap: Record<string, string[]> = {
  접수: ["task-1"],
  검토중: ["task-2"],
  설계중: ["task-3"],
  "구매/자재": ["task-4"],
  "품질/검사": [],
  "출고/완료": [],
  보류: []
};

export function KanbanPreview({ tasks }: { tasks: TaskSummary[] }) {
  return (
    <div className="grid gap-3 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-4">
      {kanbanColumns.map((column) => {
        const cards = tasks.filter((task) => columnTaskMap[column]?.includes(task.id));

        return (
          <section key={column} className="min-h-64 rounded-md border border-stone-200 bg-stone-50/80">
            <div className="flex items-center justify-between border-b border-stone-200 px-3 py-2.5">
              <h3 className="text-sm font-semibold text-stone-800">{column}</h3>
              <Badge variant="secondary">{cards.length}</Badge>
            </div>
            <div className="space-y-3 p-3">
              {cards.length === 0 ? (
                <p className="rounded-md border border-dashed border-stone-300 bg-white p-3 text-sm text-stone-500">
                  표시할 업무가 없습니다.
                </p>
              ) : (
                cards.map((task) => (
                  <article key={task.id} className="rounded-md border border-stone-200 bg-white p-3 hover:bg-stone-50">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge variant={task.isDelayed ? "destructive" : "outline"}>{task.status}</Badge>
                      <span className="text-xs text-stone-500">{task.dueDate}</span>
                    </div>
                    <h4 className="line-clamp-2 text-sm font-medium text-stone-900">{task.title}</h4>
                    <p className="mt-2 text-xs text-stone-500">
                      {task.customer} · {task.assignee} · 댓글 {task.comments} · 첨부 {task.files}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
