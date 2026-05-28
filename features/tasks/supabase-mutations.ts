import { createClient } from "@/lib/supabase/server";
import type { TaskSummary } from "@/types/domain";

import type { CreateTaskInput } from "./validators";

type CustomerRecord = {
  id: string;
  name: string;
};

type ProjectRecord = {
  id: string;
  code: string;
};

type InsertedTaskRecord = {
  id: string;
  title: string;
  type: TaskSummary["type"];
  status: TaskSummary["status"];
  due_date: string | null;
};

export async function createTaskInSupabase(input: CreateTaskInput) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const client = supabase;

  const { data: userData } = await client.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const customer = await findOrCreateCustomer(input.customer);
  const project = await findOrCreateProject(input.projectCode, customer.id, input.dueDate);

  const { data: task, error } = await client
    .from("tasks")
    .insert({
      project_id: project.id,
      customer_id: customer.id,
      title: input.title,
      body: "POC에서 생성된 업무입니다.",
      type: input.type,
      status: input.status,
      workflow_stage: "접수",
      due_date: input.dueDate,
      created_by: userData.user.id
    })
    .select("id, title, type, status, due_date")
    .single();

  if (error || !task) {
    throw new Error(error?.message ?? "Task insert failed");
  }

  const insertedTask = task as InsertedTaskRecord;

  return {
    id: insertedTask.id,
    title: insertedTask.title,
    projectCode: project.code,
    customer: customer.name,
    type: insertedTask.type,
    status: insertedTask.status,
    assignee: input.assignee,
    dueDate: insertedTask.due_date ?? input.dueDate,
    comments: 0,
    files: 0,
    isDelayed: isDelayed(insertedTask.due_date, insertedTask.status)
  } satisfies TaskSummary;

  async function findOrCreateCustomer(name: string) {
    const { data: existingCustomer, error: lookupError } = await client
      .from("customers")
      .select("id, name")
      .eq("name", name)
      .maybeSingle();

    if (lookupError) {
      throw new Error(lookupError.message);
    }

    if (existingCustomer) {
      return existingCustomer as CustomerRecord;
    }

    const { data: newCustomer, error: insertError } = await client
      .from("customers")
      .insert({
        name,
        memo: "POC 업무 생성 과정에서 자동 등록"
      })
      .select("id, name")
      .single();

    if (insertError || !newCustomer) {
      throw new Error(insertError?.message ?? "Customer insert failed");
    }

    return newCustomer as CustomerRecord;
  }

  async function findOrCreateProject(code: string, customerId: string, dueDate: string) {
    const { data: existingProject, error: lookupError } = await client
      .from("projects")
      .select("id, code")
      .eq("code", code)
      .maybeSingle();

    if (lookupError) {
      throw new Error(lookupError.message);
    }

    if (existingProject) {
      return existingProject as ProjectRecord;
    }

    const { data: newProject, error: insertError } = await client
      .from("projects")
      .insert({
        customer_id: customerId,
        code,
        name: `${code} 프로젝트`,
        description: "POC 업무 생성 과정에서 자동 등록",
        health: "정상",
        due_date: dueDate
      })
      .select("id, code")
      .single();

    if (insertError || !newProject) {
      throw new Error(insertError?.message ?? "Project insert failed");
    }

    return newProject as ProjectRecord;
  }
}

function isDelayed(dueDate: string | null, status: string) {
  return Boolean(dueDate && status !== "완료확인" && new Date(dueDate) < new Date());
}
