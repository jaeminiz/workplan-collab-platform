export type TaskType =
  | "작요"
  | "생요"
  | "설검"
  | "업무참조"
  | "자재증"
  | "검사완료"
  | "출고완료"
  | "계산서"
  | "CLAIM"
  | "SPARE"
  | "일반업무";

export type TaskStatus =
  | "미착수"
  | "진행중"
  | "검토요청"
  | "완료요청"
  | "완료확인"
  | "반려"
  | "보류";

export type ProjectHealth = "정상" | "주의" | "지연";

export interface ProjectSummary {
  id: string;
  code: string;
  name: string;
  customer: string;
  vessel?: string;
  progress: number;
  health: ProjectHealth;
  dueDate: string;
  owner: string;
  openTasks: number;
  delayedTasks: number;
  updatedAt: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  projectCode: string;
  customer: string;
  type: TaskType;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  comments: number;
  files: number;
  isDelayed: boolean;
}

export interface InboxItem {
  id: string;
  title: string;
  sender: string;
  relatedTaskId?: string;
  read: boolean;
  completed: boolean;
  createdAt: string;
}
