import { createClient } from "@/lib/supabase/server";

import type { TaskComment } from "./comments";

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string } | { display_name: string }[] | null;
};

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listTaskCommentsFromSupabase(taskId: string) {
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
    .select("id, body, created_at, profiles(display_name)")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return (data as unknown as CommentRow[]).map<TaskComment>((comment) => {
    const profile = firstRelation(comment.profiles);

    return {
      id: comment.id,
      author: profile?.display_name ?? "익명 사용자",
      body: comment.body,
      createdAt: comment.created_at.slice(0, 16).replace("T", " ")
    };
  });
}
