import type { InboxItem, ProjectSummary, TaskSummary } from "@/types/domain";

export const projectSummaries: ProjectSummary[] = [
  {
    id: "h8282",
    code: "H8282",
    name: "현대삼호중공업 ODME",
    customer: "현대삼호중공업",
    vessel: "H8282",
    progress: 68,
    health: "주의",
    dueDate: "2026-06-10",
    owner: "영업1팀",
    openTasks: 14,
    delayedTasks: 3,
    updatedAt: "2026-05-27 18:24"
  },
  {
    id: "super-hero",
    code: "SUPER HERO",
    name: "POSSM 연차검사 + 도급",
    customer: "POSSM",
    progress: 42,
    health: "정상",
    dueDate: "2026-06-29",
    owner: "영업2팀",
    openTasks: 7,
    delayedTasks: 0,
    updatedAt: "2026-05-27 18:09"
  },
  {
    id: "pegasus-hope",
    code: "SB660",
    name: "PEGASUS HOPE CLAIM",
    customer: "대선조선",
    vessel: "PEGASUS HOPE",
    progress: 51,
    health: "지연",
    dueDate: "2026-06-26",
    owner: "품질관리팀",
    openTasks: 19,
    delayedTasks: 6,
    updatedAt: "2026-05-27 18:00"
  }
];

export const taskSummaries: TaskSummary[] = [
  {
    id: "task-1",
    title: "260527_작요_PMF_POSSM_SUPER HERO_싱가폴 연차검사",
    body: "싱가폴 연차검사 관련 작요 접수 건입니다. 검사 일정, 필요 자재, 선주 요청사항을 확인하고 설계/품질 부서와 후속 일정을 조율합니다.",
    projectCode: "SUPER HERO",
    customer: "POSSM",
    type: "작요",
    status: "진행중",
    assignee: "담당자 A",
    dueDate: "2026-06-29",
    comments: 8,
    files: 2,
    isDelayed: false
  },
  {
    id: "task-2",
    title: "260508_CLAIM접수_대선조선_PEGASUS HOPE_TLGS",
    body: "CLAIM 접수 건입니다. 현장 증상, 선박 정보, 관련 도면 및 이전 처리 이력을 확인한 뒤 원인 분석과 회신 일정을 관리합니다.",
    projectCode: "SB660",
    customer: "대선조선",
    type: "CLAIM",
    status: "검토요청",
    assignee: "담당자 B",
    dueDate: "2026-05-15",
    comments: 21,
    files: 3,
    isDelayed: true
  },
  {
    id: "task-3",
    title: "260527_생요_EH ENG_BAL SPARE_PAFR 60",
    body: "BAL SPARE 관련 생산 요청 업무입니다. 품목, 납기, 구매 필요 여부를 확인하고 출고 전 검사 상태를 추적합니다.",
    projectCode: "EH 26032436J",
    customer: "EH ENG",
    type: "생요",
    status: "완료요청",
    assignee: "담당자 C",
    dueDate: "2026-06-05",
    comments: 4,
    files: 5,
    isDelayed: false
  },
  {
    id: "task-4",
    title: "260527_자재증_HD HMS_KOHAKU_H3277_BAL CLAIM",
    body: "자재 증빙 및 CLAIM 대응 업무입니다. 공급 이력, 검사 결과, 고객 요청 문서를 함께 확인해야 합니다.",
    projectCode: "H3277",
    customer: "HD HMS",
    type: "자재증",
    status: "진행중",
    assignee: "담당자 D",
    dueDate: "2026-06-05",
    comments: 9,
    files: 4,
    isDelayed: false
  }
];

export const inboxItems: InboxItem[] = [
  {
    id: "inbox-1",
    title: "260527_작요_PMF_POSSM_SUPER HERO_싱가폴 연차검사",
    sender: "영업2팀 알림",
    relatedTaskId: "task-1",
    read: true,
    completed: false,
    createdAt: "2026-05-27 18:09"
  },
  {
    id: "inbox-2",
    title: "260508_CLAIM접수_대선조선_PEGASUS HOPE",
    sender: "품질관리팀 알림",
    relatedTaskId: "task-2",
    read: true,
    completed: false,
    createdAt: "2026-05-27 18:00"
  },
  {
    id: "inbox-3",
    title: "260527_생요_EH ENG_BAL SPARE_PAFR 60",
    sender: "설계팀 알림",
    relatedTaskId: "task-3",
    read: true,
    completed: true,
    createdAt: "2026-05-27 17:58"
  }
];
