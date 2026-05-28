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
    projectCode: "SUPER HERO",
    customer: "POSSM",
    type: "작요",
    status: "진행중",
    assignee: "김진택",
    dueDate: "2026-06-29",
    comments: 8,
    files: 2,
    isDelayed: false
  },
  {
    id: "task-2",
    title: "260508_CLAIM접수_대선조선_PEGASUS HOPE_TLGS",
    projectCode: "SB660",
    customer: "대선조선",
    type: "CLAIM",
    status: "검토요청",
    assignee: "유효재",
    dueDate: "2026-05-15",
    comments: 21,
    files: 3,
    isDelayed: true
  },
  {
    id: "task-3",
    title: "260527_생요_EH ENG_BAL SPARE_PAFR 60",
    projectCode: "EH 26032436J",
    customer: "EH ENG",
    type: "생요",
    status: "완료요청",
    assignee: "김성원",
    dueDate: "2026-06-05",
    comments: 4,
    files: 5,
    isDelayed: false
  },
  {
    id: "task-4",
    title: "260527_자재증_HD HMS_KOHAKU_H3277_BAL CLAIM",
    projectCode: "H3277",
    customer: "HD HMS",
    type: "자재증",
    status: "진행중",
    assignee: "고은경",
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
    sender: "영업2팀_김진택책임",
    relatedTaskId: "task-1",
    read: true,
    completed: false,
    createdAt: "2026-05-27 18:09"
  },
  {
    id: "inbox-2",
    title: "260508_CLAIM접수_대선조선_PEGASUS HOPE",
    sender: "품관팀_CLAIM유효재",
    relatedTaskId: "task-2",
    read: true,
    completed: false,
    createdAt: "2026-05-27 18:00"
  },
  {
    id: "inbox-3",
    title: "260527_생요_EH ENG_BAL SPARE_PAFR 60",
    sender: "설계팀_BAL김성원UTLWIA",
    relatedTaskId: "task-3",
    read: true,
    completed: true,
    createdAt: "2026-05-27 17:58"
  }
];
