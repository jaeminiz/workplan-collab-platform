# Project Instructions

이 저장소는 Workplan 기반 업무협업 플랫폼을 Next.js, TypeScript, Supabase 기반으로 재설계하는 개발 프로젝트다.

## Scope

- 주요 작업 대상은 `app/`, `components/`, `features/`, `lib/`, `types/`, `supabase/`, `docs/`이다.
- 데스크탑, 노트북, 휴대폰 Codex 작업은 GitHub 원격 저장소 `jaeminiz/workplan-collab-platform`의 `master` 브랜치를 기준으로 동기화한다.
- 작업 시작 전에는 `scripts/sync-start.ps1`로 최신 변경을 받는다.
- 작업 종료 후에는 `scripts/sync-finish.ps1 "작업 내용 요약"`으로 커밋과 push까지 완료한다.

## Development Rules

- 기존 Next.js App Router, TypeScript, Tailwind CSS 패턴을 따른다.
- UI는 업무용 SaaS 도구에 맞게 조용하고 밀도 있게 구성한다.
- 서버/클라이언트 컴포넌트 경계를 명확히 유지한다.
- Supabase 의존 코드는 추후 인프라 이전 가능성을 고려해 repository/service 계층 안에 둔다.
- 인증, 권한, 고객/프로젝트/업무 데이터 흐름은 문서와 타입을 함께 갱신한다.

## Validation

변경 후 가능한 범위에서 다음 검증을 수행한다.

```powershell
npm run lint
npm run typecheck
```

사용자-facing 화면 변경이 있으면 개발 서버에서 직접 확인한다.

```powershell
npm run dev
```

## Sync

자세한 다중 기기 동기화 절차는 `docs/device-sync-workflow.md`를 따른다.
