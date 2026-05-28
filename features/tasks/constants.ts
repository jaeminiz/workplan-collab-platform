import type { TaskStatus, TaskType } from "@/types/domain";

export const taskTypes = [
  "작요",
  "생요",
  "설검",
  "업무참조",
  "자재증",
  "검사완료",
  "출고완료",
  "계산서",
  "CLAIM",
  "SPARE",
  "일반업무"
] as const satisfies readonly TaskType[];

export const taskStatuses = [
  "미착수",
  "진행중",
  "검토요청",
  "완료요청",
  "완료확인",
  "반려",
  "보류"
] as const satisfies readonly TaskStatus[];

export const kanbanColumns = [
  "접수",
  "검토중",
  "설계중",
  "구매/자재",
  "품질/검사",
  "출고/완료",
  "보류"
] as const;
