import { createClient } from "@/lib/supabase/server";

import type { TaskActivity } from "./comments";

type AuditLogRow = {
  id: string;
  action: string;
  payload: Record<string, unknown> | null;
  created_at: string;
  profiles: { display_name: string } | { display_name: string }[] | null;
};

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listTaskActivitiesFromSupabase(taskId: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, payload, created_at, profiles(display_name)")
    .eq("entity_type", "task")
    .eq("entity_id", taskId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) {
    return null;
  }

  return (data as unknown as AuditLogRow[]).map<TaskActivity>((activity) => {
    const profile = firstRelation(activity.profiles);
    const actor = profile?.display_name ?? "익명 사용자";

    return {
      id: activity.id,
      title: formatActivityTitle(activity.action, activity.payload, actor),
      createdAt: activity.created_at.slice(0, 16).replace("T", " ")
    };
  });
}

function formatActivityTitle(action: string, payload: Record<string, unknown> | null, actor: string) {
  if (action === "status.updated") {
    return `${actor}님이 상태를 ${formatPayloadValue(payload?.status)}로 변경`;
  }

  if (action === "body.updated") {
    return `${actor}님이 업무 내용을 수정`;
  }

  if (action === "comment.created") {
    return `${actor}님이 댓글을 추가`;
  }

  if (action === "metadata.updated") {
    return `${actor}님이 기본 정보를 수정`;
  }

  if (action === "assignee.updated") {
    return `${actor}님이 담당자를 변경`;
  }

  if (action === "file.uploaded") {
    return `${actor}님이 첨부파일 ${formatPayloadValue(payload?.title)}을 추가`;
  }

  if (action === "task.archived") {
    return `${actor}님이 업무를 보관 처리`;
  }

  if (action === "task.restored") {
    return `${actor}님이 보관 업무를 복구`;
  }

  return `${actor}님이 ${action} 작업 수행`;
}

function formatPayloadValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : "새 값";
}
