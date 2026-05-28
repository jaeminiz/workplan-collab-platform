export type TaskComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type TaskActivity = {
  id: string;
  title: string;
  createdAt: string;
};

export function listMockTaskComments(taskId: string): TaskComment[] {
  return [
    {
      id: `${taskId}-comment-1`,
      author: "익명 담당자",
      body: "기존 Workplan의 댓글/쪽지 흐름을 대체하기 위한 POC 댓글입니다.",
      createdAt: "2026-05-28 10:20"
    },
    {
      id: `${taskId}-comment-2`,
      author: "익명 검토자",
      body: "상태 변경, 첨부, 검토 요청 이력을 한 화면에서 확인하도록 확장합니다.",
      createdAt: "2026-05-28 11:05"
    }
  ];
}

export function listMockTaskActivities(taskId: string): TaskActivity[] {
  return [
    {
      id: `${taskId}-activity-1`,
      title: "업무 상세 화면 열람 가능",
      createdAt: "2026-05-28 12:00"
    },
    {
      id: `${taskId}-activity-2`,
      title: "상태 변경과 댓글 입력 UI 연결",
      createdAt: "2026-05-28 12:20"
    }
  ];
}
