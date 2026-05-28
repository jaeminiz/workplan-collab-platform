# Migration Strategy

## 현재 방향

초기 POC는 Supabase Free를 사용합니다. 목적은 비용을 들이지 않고 Workplan 대체 화면, 검색 UX, 업무 상태 구조, 프로젝트 대시보드, 알림 흐름을 빠르게 검증하는 것입니다.

Supabase는 최종 운영 인프라로 확정하지 않습니다. POC 종료 후 다음 기준으로 운영안을 결정합니다.

- 월 사용자 수
- 첨부파일 용량
- 검색 데이터 크기
- 외부 연동 범위
- 직접 서버 운영 가능 인력
- 월 고정비 허용 범위

## 이전 후보

| 후보 | 대상 | 장점 | 단점 |
|---|---|---|---|
| Supabase Pro | 운영 인력이 적고 빠른 출시가 중요할 때 | Auth, DB, Storage, Realtime 유지 | 월 구독 비용 |
| AWS Lightsail + RDS/S3 | 서버 운영 경험이 있고 비용 통제가 중요할 때 | VPS 감각, 점진 확장 | OS/배포/모니터링 관리 필요 |
| AWS ECS + RDS + S3 + OpenSearch | 규모와 안정성이 중요할 때 | 확장성, 운영 표준화 | 비용과 복잡도 증가 |
| 국내 호스팅 + Laravel + MariaDB | PHP/APM 운영 경험을 살릴 때 | 국내 지원, 비용 예측 | Realtime/AI/API는 직접 구현 필요 |

## 코드 설계 기준

1. Supabase client는 `lib/supabase`에만 둡니다.
2. 화면 컴포넌트는 Supabase 응답 형태에 직접 의존하지 않습니다.
3. 도메인 타입은 `types/domain.ts`를 기준으로 유지합니다.
4. API는 `/api/*` Route Handler를 통해 점진적으로 계약을 고정합니다.
5. 파일 저장소는 `storage_bucket`, `storage_path` 형태로 기록해 S3 또는 로컬 파일 서버로 이전 가능하게 합니다.
6. 검색은 PostgreSQL Full Text Search로 시작하되, OpenSearch/Meilisearch로 분리 가능한 결과 모델을 사용합니다.

## Supabase에서 AWS로 이전할 때

| Supabase | AWS |
|---|---|
| PostgreSQL | RDS PostgreSQL 또는 Aurora PostgreSQL |
| Auth | Cognito 또는 자체 Google OAuth |
| Storage | S3 |
| Realtime | API Gateway WebSocket, AppSync, 또는 자체 WebSocket |
| Edge Functions | Lambda |
| Logs | CloudWatch |

## Supabase에서 국내 PHP 호스팅으로 이전할 때

| Supabase/Next.js | 국내 호스팅 대안 |
|---|---|
| PostgreSQL | MariaDB/MySQL |
| Supabase Auth | Laravel Socialite + Google OAuth |
| Supabase Storage | 서버 파일 시스템 또는 S3 호환 스토리지 |
| Next.js API | Laravel REST API |
| Realtime | Pusher 호환 서버, SSE, 또는 polling |

MariaDB로 이전할 가능성이 있다면 PostgreSQL 전용 기능은 POC에서는 최소화합니다. 다만 검색 품질 검증을 위해 Full Text Search와 trigram 인덱스는 Supabase POC에서 먼저 사용합니다.
