import { inboxItems, projectSummaries, taskSummaries } from "@/features/projects/mock-data";

export type SearchResultType = "project" | "task" | "inbox";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  url: string;
};

function contains(value: string | undefined, query: string) {
  return value?.toLowerCase().includes(query.toLowerCase()) ?? false;
}

export function searchWorkspace(query: string): SearchResult[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const projectResults = projectSummaries
    .filter(
      (project) =>
        contains(project.name, normalizedQuery) ||
        contains(project.code, normalizedQuery) ||
        contains(project.customer, normalizedQuery) ||
        contains(project.vessel, normalizedQuery)
    )
    .map<SearchResult>((project) => ({
      id: project.id,
      type: "project",
      title: project.name,
      subtitle: `${project.customer} · ${project.code}`,
      url: `/projects?project=${project.id}`
    }));

  const taskResults = taskSummaries
    .filter(
      (task) =>
        contains(task.title, normalizedQuery) ||
        contains(task.projectCode, normalizedQuery) ||
        contains(task.customer, normalizedQuery) ||
        contains(task.assignee, normalizedQuery) ||
        contains(task.type, normalizedQuery) ||
        contains(task.status, normalizedQuery)
    )
    .map<SearchResult>((task) => ({
      id: task.id,
      type: "task",
      title: task.title,
      subtitle: `${task.projectCode} · ${task.customer} · ${task.assignee}`,
      url: `/tasks?task=${task.id}`
    }));

  const inboxResults = inboxItems
    .filter((item) => contains(item.title, normalizedQuery) || contains(item.sender, normalizedQuery))
    .map<SearchResult>((item) => ({
      id: item.id,
      type: "inbox",
      title: item.title,
      subtitle: `${item.sender} · ${item.createdAt}`,
      url: `/inbox?message=${item.id}`
    }));

  return [...projectResults, ...taskResults, ...inboxResults];
}
