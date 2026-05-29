import { createClient } from "@/lib/supabase/server";
import type { TaskFileSummary } from "@/types/domain";

const taskFileBucket = "work-files";
const maxUploadSizeBytes = 20 * 1024 * 1024;

type DocumentRow = {
  id: string;
  title: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  profiles: { display_name: string } | { display_name: string }[] | null;
};

type UploadedDocumentRow = {
  id: string;
  title: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listTaskFilesFromSupabase(taskId: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, storage_bucket, storage_path, mime_type, size_bytes, created_at, profiles(display_name)")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return (data as unknown as DocumentRow[]).map<TaskFileSummary>((file) => {
    const profile = firstRelation(file.profiles);

    return {
      id: file.id,
      title: file.title,
      mimeType: file.mime_type,
      sizeBytes: file.size_bytes,
      uploadedBy: profile?.display_name ?? "익명 사용자",
      createdAt: file.created_at.slice(0, 16).replace("T", " "),
      downloadUrl: `/api/tasks/${taskId}/files/${file.id}`
    };
  });
}

export async function uploadTaskFileToSupabase(taskId: string, file: File) {
  if (file.size > maxUploadSizeBytes) {
    throw new Error("File is too large");
  }

  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const safeFileName = file.name.replace(/[^\w.-]+/g, "_");
  const storagePath = `tasks/${taskId}/${crypto.randomUUID()}-${safeFileName}`;
  const { error: uploadError } = await supabase.storage
    .from(taskFileBucket)
    .upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .insert({
      task_id: taskId,
      title: file.name,
      storage_bucket: taskFileBucket,
      storage_path: storagePath,
      mime_type: file.type || null,
      size_bytes: file.size,
      uploaded_by: userData.user.id
    })
    .select("id, title, mime_type, size_bytes, created_at")
    .single();

  if (documentError || !document) {
    await supabase.storage.from(taskFileBucket).remove([storagePath]);
    throw new Error(documentError?.message ?? "Document insert failed");
  }

  await supabase.from("task_files").insert({
    task_id: taskId,
    document_id: document.id
  });

  await supabase.from("audit_logs").insert({
    actor_id: userData.user.id,
    entity_type: "task",
    entity_id: taskId,
    action: "file.uploaded",
    payload: { document_id: document.id, title: file.name, size_bytes: file.size }
  });

  const uploadedDocument = document as UploadedDocumentRow;

  return {
    id: uploadedDocument.id,
    title: uploadedDocument.title,
    mimeType: uploadedDocument.mime_type,
    sizeBytes: uploadedDocument.size_bytes,
    uploadedBy: userData.user.email ?? "익명 사용자",
    createdAt: uploadedDocument.created_at.slice(0, 16).replace("T", " "),
    downloadUrl: `/api/tasks/${taskId}/files/${uploadedDocument.id}`
  } satisfies TaskFileSummary;
}

export async function createTaskFileDownloadUrl(taskId: string, documentId: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data: document, error } = await supabase
    .from("documents")
    .select("storage_bucket, storage_path")
    .eq("id", documentId)
    .eq("task_id", taskId)
    .single();

  if (error || !document) {
    return null;
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(document.storage_bucket as string)
    .createSignedUrl(document.storage_path as string, 60);

  if (signedUrlError || !data.signedUrl) {
    throw new Error(signedUrlError?.message ?? "Signed URL creation failed");
  }

  return data.signedUrl;
}
