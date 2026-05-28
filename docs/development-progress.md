# Development Progress

## 현재 진행률

진행률: 92%

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

## 진행 중

- Supabase 콘솔 Google OAuth Provider 활성화
- Google Cloud OAuth Client 생성
- 업무 CRUD
- 첨부파일 업로드/다운로드
- 실제 활동 로그 DB 조회
- 검색 결과 상세 링크 정리

## 남은 작업

- 로그인/세션 처리
- 프로젝트/업무 생성, 수정, 상태 변경
- 댓글/첨부파일
- 통합검색 실제 DB 연결
- ERP 연동 실제 인증/동기화
- 외부 공개 POC 배포
- 모바일 대응 강화
- 배포 사이트 공개

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
