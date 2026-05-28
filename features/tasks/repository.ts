import { taskSummaries } from "@/features/projects/mock-data";
import type { TaskStatus, TaskType } from "@/types/domain";

type TaskFilters = {
  status?: TaskStatus;
  type?: TaskType;
  assignee?: string;
};

export function listTasks(filters: TaskFilters = {}) {
  return taskSummaries.filter((task) => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    if (filters.type && task.type !== filters.type) {
      return false;
    }

    if (filters.assignee && !task.assignee.includes(filters.assignee)) {
      return false;
    }

    return true;
  });
}

export function getTaskById(id: string) {
  return taskSummaries.find((task) => task.id === id) ?? null;
}
