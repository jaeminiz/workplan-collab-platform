import { projectSummaries, taskSummaries } from "@/features/projects/mock-data";

export function listProjects() {
  return projectSummaries;
}

export function getProjectById(id: string) {
  return projectSummaries.find((project) => project.id === id) ?? null;
}

export function listProjectTasks(projectCode?: string) {
  if (!projectCode) {
    return taskSummaries;
  }

  return taskSummaries.filter((task) => task.projectCode.toLowerCase() === projectCode.toLowerCase());
}
