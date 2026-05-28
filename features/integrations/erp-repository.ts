import type { ErpMapping, IntegrationSummary } from "@/types/domain";

export const integrationSummaries: IntegrationSummary[] = [
  {
    provider: "erp",
    name: "ERP 연동",
    status: "not_configured",
    description: "고객, 프로젝트, 구매, 재고, 출고, 계산서 데이터를 ERP와 동기화합니다.",
    requiredSecrets: ["ERP_BASE_URL", "ERP_CLIENT_ID", "ERP_CLIENT_SECRET"]
  },
  {
    provider: "google",
    name: "Google Workspace",
    status: "not_configured",
    description: "Google OAuth, Gmail, Drive, Calendar, Gemini 연동의 기준 계정입니다.",
    requiredSecrets: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
  },
  {
    provider: "slack",
    name: "Slack",
    status: "not_configured",
    description: "업무 알림과 간단한 상태 변경 명령을 Slack으로 연결합니다.",
    requiredSecrets: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"]
  },
  {
    provider: "kakao",
    name: "Kakao/Telegram",
    status: "not_configured",
    description: "모바일 메신저 알림과 업무 조회를 위한 확장 지점입니다.",
    requiredSecrets: ["KAKAO_CLIENT_ID", "TELEGRAM_BOT_TOKEN"]
  }
];

export const erpMappings: ErpMapping[] = [
  {
    id: "erp-customer",
    erpSystem: "generic-rest-erp",
    entityType: "customer",
    localEntity: "customers",
    externalEntity: "customers",
    syncDirection: "bidirectional",
    enabled: true
  },
  {
    id: "erp-project",
    erpSystem: "generic-rest-erp",
    entityType: "project",
    localEntity: "projects",
    externalEntity: "projects",
    syncDirection: "pull",
    enabled: true
  },
  {
    id: "erp-invoice",
    erpSystem: "generic-rest-erp",
    entityType: "invoice",
    localEntity: "tasks",
    externalEntity: "sales_invoices",
    syncDirection: "pull",
    enabled: false
  },
  {
    id: "erp-inventory",
    erpSystem: "generic-rest-erp",
    entityType: "inventory_item",
    localEntity: "tasks",
    externalEntity: "inventory_items",
    syncDirection: "pull",
    enabled: false
  }
];

export function listIntegrationSummaries() {
  return integrationSummaries;
}

export function listErpMappings() {
  return erpMappings;
}
