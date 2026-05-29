# MiniPark Work OS

Workplan의 프로젝트, 업무, 쪽지, 문서, 웹디스크, 고객관리 흐름을 유지하면서 검색 중심 SaaS형 협업 플랫폼으로 재설계하는 초기 Next.js 앱입니다.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 스타일 컴포넌트
- Supabase Free POC: Auth, PostgreSQL, Storage, Realtime
- TanStack Query

## Infrastructure Direction

초기 목표는 비용을 최소화해 POC를 빠르게 검증하는 것입니다.

```text
POC: Next.js + Supabase Free + Vercel Free
운영 검토: Supabase Pro 유지 또는 AWS/국내 호스팅으로 마이그레이션
```

Supabase는 최종 인프라로 고정하지 않습니다. 핵심 도메인 로직은 `features/`, `lib/`, `types/`에 분리하고, DB 접근은 추후 repository/service 계층으로 감싸서 PostgreSQL, AWS RDS, 국내 호스팅 MariaDB/Laravel API로 이전할 수 있게 설계합니다.

## Getting Started

```bash
npm install
npm run dev
```

환경변수는 `.env.example`을 참고해 `.env.local`에 설정합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_WORKSPACE_DOMAIN=
```

## Two-PC Sync Workflow

작업을 시작하기 전에는 최신 원격 상태를 먼저 받습니다.

```powershell
.\scripts\sync-start.ps1
```

작업을 마친 뒤에는 커밋 메시지를 지정해 커밋과 push를 한 번에 처리합니다.

```powershell
.\scripts\sync-finish.ps1 "작업 내용 요약"
```

다른 PC에서는 다시 `sync-start.ps1`을 실행하면 GitHub에 올라간 최신 작업을 이어받을 수 있습니다. 데스크탑 또는 노트북에서 commit만 하고 push하지 않은 작업은 다른 PC에서 받을 수 없습니다.

## Initial Screens

- `/login`: Google Workspace OAuth 로그인 준비 화면
- `/dashboard`: 개인 대시보드
- `/projects`: 프로젝트 목록
- `/tasks`: 칸반 기반 업무 관리
- `/inbox`: 쪽지/알림
- `/search`: 통합검색
- `/documents`: 문서/파일
- `/customers`: 고객관리
- `/settings`: 외부 연동 설정

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Docs

- [Architecture](docs/architecture.md)
- [Feature Specification](docs/feature-spec.md)
- [Migration Strategy](docs/migration-strategy.md)
- [ERP Integration Plan](docs/integrations-erp.md)
- [Development Progress](docs/development-progress.md)
- [Deployment Status](docs/deployment-status.md)
- [Google OAuth Setup](docs/google-oauth-setup.md)
- [Supabase Setup](supabase/README.md)
