"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/features/tasks/files";
import type { TaskFileSummary } from "@/types/domain";

type TaskFilePanelProps = {
  taskId: string;
  files: TaskFileSummary[];
};

async function uploadTaskFile(taskId: string, file: File) {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch(`/api/tasks/${taskId}/files`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("첨부파일 업로드에 실패했습니다.");
  }

  return response.json() as Promise<{ mode: "supabase" | "poc-dry-run"; message: string }>;
}

export function TaskFilePanel({ taskId, files }: TaskFilePanelProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!selectedFile) {
        throw new Error("파일을 선택해 주세요.");
      }

      return uploadTaskFile(taskId, selectedFile);
    },
    onSuccess: () => {
      setSelectedFile(null);
      router.refresh();
    }
  });

  const selectedFileLabel = useMemo(() => {
    if (!selectedFile) {
      return "선택된 파일 없음";
    }

    return `${selectedFile.name} · ${formatFileSize(selectedFile.size)}`;
  }, [selectedFile]);

  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 p-4">
        <h2 className="text-sm font-semibold text-stone-900">첨부파일</h2>
        <Badge variant="secondary">{files.length}건</Badge>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="block rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-600">
            <input
              type="file"
              className="sr-only"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            {selectedFileLabel}
          </label>
          <Button type="button" onClick={() => mutation.mutate()} disabled={!selectedFile || mutation.isPending}>
            <Upload className="h-4 w-4" />
            {mutation.isPending ? "업로드 중" : "파일 업로드"}
          </Button>
        </div>
        <p className="text-sm text-stone-500">
          {mutation.isSuccess ? mutation.data.message : "파일은 업무별 Storage 경로에 저장되고 문서 검색 대상으로 기록됩니다."}
          {mutation.isError ? " 첨부파일 업로드 요청에 실패했습니다." : null}
        </p>
      </div>
      <div className="divide-y divide-stone-100">
        {files.length === 0 ? (
          <div className="p-4 text-sm text-stone-500">등록된 첨부파일이 없습니다.</div>
        ) : null}
        {files.map((file) => (
          <div key={file.id} className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <a href={file.downloadUrl} className="text-sm font-medium text-stone-900 hover:underline">
                {file.title}
              </a>
              <p className="mt-1 text-xs text-stone-500">
                {file.uploadedBy} · {file.createdAt} · {formatFileSize(file.sizeBytes)}
              </p>
            </div>
            <Badge variant="outline">{file.mimeType ?? "파일"}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
