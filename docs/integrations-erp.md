# ERP Integration Plan

## 목표

MiniPark Work OS는 초기 POC에서는 Supabase Free를 사용하지만, 운영 단계에서 ERP와 연결될 수 있도록 API와 DB 모델을 분리합니다.

ERP 연동 대상 후보:

- 고객사
- 프로젝트/호선
- 업무/작업 요청
- 구매 발주
- 재고/자재
- 출고
- 계산서

## 연동 방식

| 방식 | 설명 | 우선순위 |
|---|---|---:|
| REST API | ERP가 API를 제공할 때 사용 | 1 |
| CSV/Excel Batch | ERP API가 없거나 폐쇄망일 때 파일 교환 | 2 |
| DB View/Replica | 사내망에서 읽기 전용 DB 접근이 가능할 때 | 3 |
| RPA | API/DB 접근이 모두 어려울 때 임시 사용 | 4 |

## API 계약

초기 POC API:

- `GET /api/integrations`
- `GET /api/integrations/erp`
- `POST /api/integrations/erp`

`POST /api/integrations/erp`는 현재 dry-run 검증만 수행합니다. Supabase 연결 후에는 `integration_events` 테이블에 저장하고 queue worker 또는 Edge Function에서 처리합니다.

예시 payload:

```json
{
  "erpSystem": "generic-rest-erp",
  "entityType": "invoice",
  "externalId": "INV-2026-0001",
  "operation": "upsert"
}
```

## DB 모델

- `integration_accounts`: ERP/API 계정과 인증 정보
- `integration_mappings`: 내부 데이터와 ERP 데이터의 매핑
- `integration_events`: inbound/outbound 동기화 이벤트
- `audit_logs`: 동기화 결과와 변경 이력 추적

## 운영 전 확인 사항

1. ERP 제품명과 버전
2. API 제공 여부
3. 인증 방식: API Key, OAuth2, Basic, 사설 VPN
4. 데이터 소유 기준: ERP가 원본인지, MiniPark가 원본인지
5. 동기화 주기: 실시간, 5분, 1시간, 일배치
6. 실패 재처리 정책
7. 개인정보/영업정보 반출 범위
