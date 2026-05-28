# Development Progress

## 현재 진행률

진행률: 55%

## 완료

- Next.js App Router 초기 앱
- TypeScript, Tailwind, ESLint, Prettier
- MiniPark Work OS 제품명 적용
- 대시보드, 프로젝트, 업무, 쪽지/알림, 검색, 문서, 고객관리, 설정 화면
- Supabase Free POC 기준 DB migration 초안
- 프로젝트/업무/검색 mock API
- 통합검색 UI와 `/api/search` 연결
- ERP 연동 확장 API 초안
- AWS/국내 호스팅 마이그레이션 전략 문서
- Notion 스타일을 참고한 조용한 워크스페이스 UI 개선 및 브라우저 렌더링 확인

## 진행 중

- Supabase 실제 프로젝트 연결
- Google OAuth 로그인 연결
- DB repository를 mock에서 Supabase로 전환
- 업무 CRUD
- 검색 UI를 `/api/search`와 연결

## 남은 작업

- Supabase Free 프로젝트 생성 및 환경변수 연결
- migration 적용
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

외부에서 접근 가능한 POC 사이트는 Vercel 또는 다른 호스팅에 배포한 뒤 확정합니다.
