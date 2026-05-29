# Supabase Setup

이 앱은 Supabase Cloud를 기본 백엔드로 사용합니다.

## Local/Cloud 적용 순서

1. Supabase 프로젝트를 생성합니다.
2. Google Workspace OAuth provider를 활성화합니다.
3. `.env.example`을 기준으로 `.env.local`을 만듭니다.
4. `supabase/migrations/0001_initial_schema.sql`을 적용합니다.
5. `supabase/migrations/0002_auth_session_profiles.sql`을 적용합니다.
6. `supabase/migrations/0003_storage_work_files.sql`을 적용합니다.
7. `supabase/migrations/0004_task_archive.sql`을 적용합니다.

자세한 운영 적용 순서는 `docs/production-readiness-checklist.md`를 따릅니다.

적용 후 검증:

```text
supabase/verification.sql
```

## 초기 보안 원칙

- 모든 업무 데이터 테이블은 RLS를 활성화합니다.
- 초기 정책은 로그인 사용자 조회 중심으로 열어두고, 운영 전 부서/역할 기반 정책으로 좁힙니다.
- Service role key는 서버 작업과 마이그레이션 전용으로만 사용합니다.

## 검색

- 프로젝트, 업무, 댓글, 문서에 `search_vector`를 둡니다.
- 제목/고객명 오타 대응을 위해 trigram 인덱스를 둡니다.
- 첨부 OCR, 대용량 검색, 의미 검색이 필요하면 OpenSearch 또는 pgvector를 별도 단계로 추가합니다.
