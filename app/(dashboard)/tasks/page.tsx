import { KanbanPreview } from "@/components/task/kanban-preview";
import { TaskCreateForm } from "@/components/task/task-create-form";
import { listTasksFromSupabase } from "@/features/projects/supabase-repository";
import { listTasks } from "@/features/tasks/repository";

export default async function TasksPage() {
  const tasks = (await listTasksFromSupabase()) ?? listTasks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">업무 관리</h1>
        <p className="mt-2 text-sm text-stone-500">
          Workplan의 업무명을 구조화 필드로 분리하고, 상태와 흐름을 칸반으로 확인합니다.
        </p>
      </div>
      <TaskCreateForm />
      <KanbanPreview tasks={tasks} />
    </div>
  );
}
