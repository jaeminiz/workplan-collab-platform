import { inboxItems, projectSummaries, taskSummaries } from "@/features/projects/mock-data";
import { createClient } from "@/lib/supabase/server";

export type SearchResultType = "project" | "task" | "comment" | "customer" | "inbox";

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
      url: `/projects/${project.id}`
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
      url: `/tasks/${task.id}`
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

type ProjectSearchRow = {
  id: string;
  code: string;
  name: string;
  customers: { name: string } | { name: string }[] | null;
};

type TaskSearchRow = {
  id: string;
  title: string;
  projects: { code: string } | { code: string }[] | null;
  customers: { name: string } | { name: string }[] | null;
};

type CommentSearchRow = {
  id: string;
  body: string;
  task_id: string;
  tasks:
    | {
        title: string;
        projects: { code: string } | { code: string }[] | null;
        customers: { name: string } | { name: string }[] | null;
      }
    | {
        title: string;
        projects: { code: string } | { code: string }[] | null;
        customers: { name: string } | { name: string }[] | null;
      }[]
    | null;
};

type CustomerSearchRow = {
  id: string;
  name: string;
  company_code: string | null;
};

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function searchWorkspaceFromSupabase(query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const client = supabase;

  const [projects, tasks, comments, customers] = await Promise.all([
    searchProjects(normalizedQuery),
    searchTasks(normalizedQuery),
    searchComments(normalizedQuery),
    searchCustomers(normalizedQuery)
  ]);

  if (!projects || !tasks || !comments || !customers) {
    return null;
  }

  return [...projects, ...tasks, ...comments, ...customers];

  async function searchProjects(searchQuery: string) {
    const { data, error } = await client
      .from("projects")
      .select("id, code, name, customers(name)")
      .textSearch("search_vector", searchQuery, { config: "simple", type: "websearch" })
      .limit(10);

    if (error || !data) {
      return null;
    }

    return (data as unknown as ProjectSearchRow[]).map<SearchResult>((project) => {
      const customer = firstRelation(project.customers);

      return {
        id: project.id,
        type: "project",
        title: project.name,
        subtitle: `${customer?.name ?? "미지정 고객"} · ${project.code}`,
        url: `/projects/${project.id}`
      };
    });
  }

  async function searchTasks(searchQuery: string) {
    const { data, error } = await client
      .from("tasks")
      .select("id, title, projects(code), customers(name)")
      .textSearch("search_vector", searchQuery, { config: "simple", type: "websearch" })
      .limit(10);

    if (error || !data) {
      return null;
    }

    return (data as unknown as TaskSearchRow[]).map<SearchResult>((task) => {
      const project = firstRelation(task.projects);
      const customer = firstRelation(task.customers);

      return {
        id: task.id,
        type: "task",
        title: task.title,
        subtitle: `${project?.code ?? "미지정"} · ${customer?.name ?? "미지정 고객"}`,
        url: `/tasks/${task.id}`
      };
    });
  }

  async function searchComments(searchQuery: string) {
    const { data, error } = await client
      .from("task_comments")
      .select("id, body, task_id, tasks(title, projects(code), customers(name))")
      .textSearch("search_vector", searchQuery, { config: "simple", type: "websearch" })
      .limit(10);

    if (error || !data) {
      return null;
    }

    return (data as unknown as CommentSearchRow[]).map<SearchResult>((comment) => {
      const task = firstRelation(comment.tasks);
      const project = firstRelation(task?.projects ?? null);
      const customer = firstRelation(task?.customers ?? null);

      return {
        id: comment.id,
        type: "comment",
        title: comment.body.length > 80 ? `${comment.body.slice(0, 80)}...` : comment.body,
        subtitle: `${task?.title ?? "업무 댓글"} · ${project?.code ?? "미지정"} · ${customer?.name ?? "미지정 고객"}`,
        url: `/tasks/${comment.task_id}`
      };
    });
  }

  async function searchCustomers(searchQuery: string) {
    const { data, error } = await client
      .from("customers")
      .select("id, name, company_code")
      .textSearch("search_vector", searchQuery, { config: "simple", type: "websearch" })
      .limit(10);

    if (error || !data) {
      return null;
    }

    return (data as CustomerSearchRow[]).map<SearchResult>((customer) => ({
      id: customer.id,
      type: "customer",
      title: customer.name,
      subtitle: customer.company_code ? `고객 코드 ${customer.company_code}` : "고객",
      url: "/customers"
    }));
  }
}
