# Architecture

## 목표

기존 Workplan의 게시판형 업무 흐름을 유지하되, 업무명에 섞여 있던 고객, 호선, 품목, 납기, 담당자, 업무유형을 구조화하고 통합검색, 칸반, 간트, 대시보드를 기본 경험으로 제공합니다.

## 애플리케이션 구조

```text
app/
  (auth)/
  (dashboard)/
  api/
components/
  ui/
  layout/
  project/
  task/
  dashboard/
  search/
features/
  auth/
  projects/
  tasks/
  comments/
  files/
  inbox/
  search/
  dashboards/
  integrations/
lib/
  supabase/
  auth/
  api/
  validators/
  utils/
types/
supabase/
  migrations/
docs/
```

## Backend For POC

Supabase Cloud Free를 1차 POC 백엔드로 사용합니다. 이유는 로그인, DB, 파일, 실시간 알림을 직접 구축하지 않고 업무 흐름을 먼저 검증하기 위해서입니다.

- Auth: Google Workspace OAuth
- Database: PostgreSQL
- Storage: 도면, 첨부, 문서
- Realtime: 댓글, 상태 변경, 알림
- Edge Functions 후보: Gmail, Gemini, Slack, Telegram, Kakao webhook

## Migration Ready 원칙

Supabase에 직접 종속되는 코드를 화면 곳곳에 흩뿌리지 않습니다.

- 도메인 타입은 `types/`에 둡니다.
- 업무 규칙과 화면용 데이터 가공은 `features/`에 둡니다.
- Supabase client는 `lib/supabase/`에 격리합니다.
- 실제 DB 호출이 붙는 단계에서는 `features/*/repositories` 계층을 추가합니다.
- API 응답은 REST/JSON 형태를 유지해 AWS, 국내 호스팅, 모바일 앱, MCP 서버가 같은 계약을 쓰게 합니다.

운영 이전 후보:

- Supabase Pro + Vercel 유지
- AWS Lightsail/RDS/S3
- AWS ECS/RDS/S3/OpenSearch
- 국내 서버호스팅 + Laravel API + MariaDB

## API

Next.js Route Handler를 내부 API 계층으로 사용합니다. 초기 API v1 범위는 다음입니다.

- Auth
- Project
- Task
- Comment
- File
- Inbox
- Search
- Dashboard
- Integration

향후 CLI와 MCP 서버는 같은 API를 호출하도록 OpenAPI 문서를 생성합니다.

## Frontend

Next.js App Router를 사용하고, 화면은 대시보드 중심으로 구성합니다. TanStack Query는 클라이언트 캐시와 실시간 갱신의 기준이 됩니다.

## Mobile

초기 PR에는 포함하지 않습니다. API가 안정화된 뒤 Flutter 기반 Android/iOS 앱을 별도 패키지로 추가하는 전략을 권장합니다.
