import type { TaskFileSummary } from "@/types/domain";

export function listMockTaskFiles(taskId: string): TaskFileSummary[] {
  return [
    {
      id: `${taskId}-file-1`,
      title: "업무 첨부 샘플.pdf",
      mimeType: "application/pdf",
      sizeBytes: 248000,
      uploadedBy: "익명 담당자",
      createdAt: "2026-05-28 13:10",
      downloadUrl: "#"
    }
  ];
}

export function formatFileSize(sizeBytes: number | null) {
  if (!sizeBytes) {
    return "-";
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} KB`;
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}
