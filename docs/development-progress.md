# Development Progress

## 현재 진행률

진행률: 99%

## 완료

- Next.js App Router 초기 앱
- TypeScript, Tailwind, ESLint, Prettier
- MiniPark Work OS 제품명 적용
- 대시보드, 프로젝트, 업무, 쪽지/알림, 검색, 문서, 고객관리, 설정 화면
- Supabase Free POC 기준 DB migration 초안
- 프로젝트/업무/검색 mock API
- 통합검색 UI와 `/api/search` 연결
- POC 화면의 개인 이름 익명 처리
- 업무 생성 UI와 `POST /api/tasks` 검증 API
- Supabase Free 조직/프로젝트 생성
- Vercel Production/Preview 환경변수 연결
- Supabase 초기 migration 적용
- 공개 Vercel 배포에서 Supabase 환경변수 인식 확인
- Supabase Auth Google 로그인 시작/콜백/로그아웃 라우트 추가
- Supabase seed SQL 준비
- 로그인 사용자는 Supabase DB, 비로그인은 mock 데이터로 fallback하는 repository 구조 추가
- 로그인 사용자의 업무 생성 Supabase insert 전환
- 프로젝트/업무 목록 클릭 가능한 상세 링크 연결
- 프로젝트 상세 화면과 업무 상세 화면 초안 추가
- 업무 상세 상태 변경 UI와 API 추가
- Workplan 게시글 본문에 해당하는 업무 내용 작성/수정 UI와 API 추가
- 업무 상세 댓글 입력 UI와 API 추가
- 업무 상세 활동 로그 초안 추가
- Supabase seed 데이터 적용 및 row count 확인
- ERP 연동 확장 API 초안
- AWS/국내 호스팅 마이그레이션 전략 문서
- Notion 스타일을 참고한 조용한 워크스페이스 UI 개선 및 브라우저 렌더링 확인
- Supabase SSR middleware 세션 갱신 추가
- 로그인 성공 후 프로필 upsert 및 Workspace 도메인 검증 흐름 추가
- 대시보드 상단 로그인/로그아웃 상태 표시
- 통합 상태 API의 Supabase 설정값 boolean 응답 수정
- 업무 상세에서 업무명, 유형, 납기 수정 UI/API 추가
- 업무 상세 댓글 작성자 Supabase profile join 적용
- 업무 상세 활동 로그를 Supabase `audit_logs` 조회로 전환
- 통합검색을 로그인 사용자 기준 Supabase 프로젝트/업무/댓글/고객 검색으로 확장
- Supabase Storage `work-files` bucket migration 초안 추가
- 업무 상세 첨부파일 목록/업로드/다운로드 API 및 UI 추가
- 통합검색 대상에 첨부 파일명 추가
- 업무 삭제 대신 `archived_at` 기반 보관 처리 API/UI 추가
- Supabase 업무 목록 조회에 상태/유형/담당자 필터 반영
- 검색 결과 타입별 한글 라벨, 아이콘, 출처 표시 UX 정리
- 보관 업무 목록 화면과 복구 API/UI 추가
- Supabase profile 기반 담당자 목록 API 추가
- 업무 상세 담당자 배정 UI와 Supabase `assignee_id` 저장 API 추가
- 운영 적용용 production readiness 체크리스트 문서 추가
- 설정 화면과 health API에 OAuth, migration, 앱 URL 점검 정보 추가
- 공개 POC smoke test PowerShell 스크립트 추가
- Supabase 운영 migration 적용 검증 SQL 추가

## 진행 중

- Supabase 콘솔 Google OAuth Provider 활성화
- Google Cloud OAuth Client 생성
- 공개 POC smoke test에서 Google Provider 비활성화 차단 확인

## 남은 작업

- Supabase profile/audit log/storage RLS 추가 migration 운영 DB 적용
- ERP 연동 실제 인증/동기화
- 외부 공개 POC 배포
- 모바일 대응 강화
- 배포 사이트 공개

## 다음 개발 마일스톤

### M1. 인증/세션 기반 정리

상태: 코드 1차 완료, 운영 DB migration 적용 대기

- Supabase SSR middleware로 쿠키 세션 갱신
- Google OAuth callback 이후 `profiles` 자동 생성/갱신
- `GOOGLE_WORKSPACE_DOMAIN` 기반 회사 계정 제한
- 대시보드 상단 로그인 사용자/로그아웃 표시

### M2. 업무 CRUD 완성

상태: 코드 1차 완료

- 업무 상세 조회를 Supabase 우선으로 전환
- 업무 제목, 유형, 납기 수정 API/UI 추가
- 담당자 배정은 `profiles` 선택 UX와 함께 추가
- 업무 삭제 대신 보관 정책 적용 및 API/UI 추가
- 보관 업무 목록과 복구 API/UI 추가
- mock fallback과 로그인 사용자 DB 저장 흐름 유지

### M3. 댓글/활동 로그 실제 DB 연결

상태: 코드 완료, 운영 DB migration 적용 대기

- 댓글 목록을 `task_comments` DB 조회로 전환
- 상태/본문/댓글 변경 이력을 `audit_logs`에서 조회
- 비로그인 상태에서는 mock fallback 유지

### M4. 통합검색 DB 연결

상태: 코드 1차 완료

- 프로젝트, 업무, 댓글, 첨부 파일명, 고객 검색을 PostgreSQL FTS/trigram으로 연결
- 검색 결과 상세 링크, 타입 라벨, 출처 표시 정리
- 비로그인 fallback 유지 여부 결정

### M5. 첨부파일 업로드/다운로드

상태: 코드 1차 완료, 운영 Storage migration 적용 대기

- Supabase Storage bucket 정책 정리
- 업무 첨부 업로드/다운로드 API 추가
- 문서/파일 화면과 업무 상세 첨부 영역 연결

### M6. 공개 POC 안정화와 외부 연동

상태: 대기

- Vercel Production 환경에서 OAuth end-to-end 검증
- ERP/Gmail/Gemini/알림 연동의 실제 인증 방식 확정
- 모바일 대응과 배포 공개 체크리스트 완료

## POC 확인 방법

로컬 개발 서버:

```bash
npm run dev
```

접속:

```text
http://127.0.0.1:3000
```

외부에서 접근 가능한 POC 사이트:

```text
https://workplan-collab-platform.vercel.app
```
