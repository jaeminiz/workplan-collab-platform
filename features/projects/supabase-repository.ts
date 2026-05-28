import { createClient } from "@/lib/supabase/server";
import type { ProjectSummary, TaskSummary } from "@/types/domain";

type ProjectRow = {
  id: string;
  code: string;
  name: string;
  vessel: string | null;
  health: ProjectSummary["health"];
  due_date: string | null;
  updated_at: string;
  customers: { name: string } | { name: string }[] | null;
  tasks: { id: string; status: string; due_date: string | null }[];
};

type TaskRow = {
  id: string;
  title: string;
  body: string | null;
  type: TaskSummary["type"];
  status: TaskSummary["status"];
  due_date: string | null;
  projects: { code: string } | { code: string }[] | null;
  customers: { name: string } | { name: string }[] | null;
  task_comments: { id: string }[];
  task_files: { document_id: string }[];
};

function formatDateTime(value: string) {
  return value.slice(0, 16).replace("T", " ");
}

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function isDelayed(dueDate: string | null, status: string) {
  return Boolean(dueDate && status !== "완료확인" && new Date(dueDate) < new Date());
}

export async function listProjectsFromSupabase() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, code, name, vessel, health, due_date, updated_at, customers(name), tasks(id, status, due_date)")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return (data as unknown as ProjectRow[]).map<ProjectSummary>((project) => {
    const customer = firstRelation(project.customers);
    const openTasks = project.tasks.filter((task) => task.status !== "완료확인").length;
    const delayedTasks = project.tasks.filter((task) => isDelayed(task.due_date, task.status)).length;
    const completedTasks = project.tasks.length - openTasks;
    const progress = project.tasks.length > 0 ? Math.round((completedTasks / project.tasks.length) * 100) : 0;

    return {
      id: project.id,
      code: project.code,
      name: project.name,
      customer: customer?.name ?? "미지정 고객",
      vessel: project.vessel ?? undefined,
      progress,
      health: project.health,
      dueDate: project.due_date ?? "-",
      owner: "익명 부서",
      openTasks,
      delayedTasks,
      updatedAt: formatDateTime(project.updated_at)
    };
  });
}

export async function getProjectByIdFromSupabase(id: string) {
  const projects = await listProjectsFromSupabase();

  if (!projects) {
    return null;
  }

  return projects.find((project) => project.id === id) ?? null;
}

export async function findProjectByCodeFromSupabase(code: string) {
  const projects = await listProjectsFromSupabase();

  if (!projects) {
    return null;
  }

  return projects.find((project) => project.code.toLowerCase() === code.toLowerCase()) ?? null;
}

export async function listTasksFromSupabase() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, body, type, status, due_date, projects(code), customers(name), task_comments(id), task_files(document_id)")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return (data as unknown as TaskRow[]).map<TaskSummary>((task, index) => {
    const project = firstRelation(task.projects);
    const customer = firstRelation(task.customers);

    return {
    id: task.id,
    title: task.title,
    body: task.body ?? undefined,
    projectCode: project?.code ?? "미지정",
    customer: customer?.name ?? "미지정 고객",
    type: task.type,
    status: task.status,
    assignee: `담당자 ${String.fromCharCode(65 + index)}`,
    dueDate: task.due_date ?? "-",
    comments: task.task_comments.length,
    files: task.task_files.length,
    isDelayed: isDelayed(task.due_date, task.status)
  };
  });
}

export async function getTaskByIdFromSupabase(id: string) {
  const tasks = await listTasksFromSupabase();

  if (!tasks) {
    return null;
  }

  return tasks.find((task) => task.id === id) ?? null;
}
