import { createClient } from "@/lib/supabase/server";
import type { TaskSummary } from "@/types/domain";

import type {
  CreateTaskCommentInput,
  CreateTaskInput,
  UpdateTaskBodyInput,
  UpdateTaskMetadataInput,
  UpdateTaskStatusInput
} from "./validators";

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

export async function updateTaskStatusInSupabase(taskId: string, input: UpdateTaskStatusInput) {
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
    .update({
      status: input.status,
      completed_at: input.status === "완료확인" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq("id", taskId)
    .select("id, status")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task status update failed");
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "status.updated",
    payload: { status: input.status }
  });

  return {
    id: data.id as string,
    status: data.status as TaskSummary["status"]
  };
}

export async function updateTaskBodyInSupabase(taskId: string, input: UpdateTaskBodyInput) {
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
    .update({
      body: input.body,
      updated_at: new Date().toISOString()
    })
    .eq("id", taskId)
    .select("id, body")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task body update failed");
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "body.updated",
    payload: { body_length: input.body.length }
  });

  return {
    id: data.id as string,
    body: data.body as string
  };
}

export async function updateTaskMetadataInSupabase(taskId: string, input: UpdateTaskMetadataInput) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const updates: {
    title?: string;
    type?: TaskSummary["type"];
    due_date?: string;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString()
  };

  if (input.title) {
    updates.title = input.title;
  }

  if (input.type) {
    updates.type = input.type;
  }

  if (input.dueDate) {
    updates.due_date = input.dueDate;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select("id, title, type, due_date")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task metadata update failed");
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "metadata.updated",
    payload: {
      title: input.title,
      type: input.type,
      due_date: input.dueDate
    }
  });

  return {
    id: data.id as string,
    title: data.title as string,
    type: data.type as TaskSummary["type"],
    dueDate: (data.due_date as string | null) ?? "-"
  };
}

export async function updateTaskAssigneeInSupabase(taskId: string, assigneeId: string | null) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      assignee_id: assigneeId,
      updated_at: updatedAt
    })
    .eq("id", taskId)
    .select("id, assignee_id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task assignee update failed");
  }

  if (assigneeId) {
    await supabase.from("task_assignees").upsert(
      {
        task_id: taskId,
        profile_id: assigneeId,
        role: "assignee"
      },
      { onConflict: "task_id,profile_id" }
    );
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "assignee.updated",
    payload: { assignee_id: assigneeId }
  });

  return {
    id: data.id as string,
    assigneeId: data.assignee_id as string | null
  };
}

export async function createTaskCommentInSupabase(taskId: string, input: CreateTaskCommentInput) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("task_comments")
    .insert({
      task_id: taskId,
      author_id: userData.user.id,
      body: input.body
    })
    .select("id, body, created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task comment insert failed");
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "comment.created",
    payload: { comment_id: data.id }
  });

  return {
    id: data.id as string,
    author: "익명 사용자",
    body: data.body as string,
    createdAt: String(data.created_at).slice(0, 16).replace("T", " ")
  };
}

export async function archiveTaskInSupabase(taskId: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const archivedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      archived_at: archivedAt,
      archived_by: userData.user.id,
      updated_at: archivedAt
    })
    .eq("id", taskId)
    .is("archived_at", null)
    .select("id, archived_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task archive failed");
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "task.archived",
    payload: { archived_at: archivedAt }
  });

  return {
    id: data.id as string,
    archivedAt: data.archived_at as string
  };
}

export async function restoreTaskInSupabase(taskId: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      archived_at: null,
      archived_by: null,
      updated_at: updatedAt
    })
    .eq("id", taskId)
    .not("archived_at", "is", null)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Task restore failed");
  }

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "task.restored",
    payload: { restored_at: updatedAt }
  });

  return {
    id: data.id as string,
    restoredAt: updatedAt
  };
}

function isDelayed(dueDate: string | null, status: string) {
  return Boolean(dueDate && status !== "완료확인" && new Date(dueDate) < new Date());
}
