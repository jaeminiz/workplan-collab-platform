# Production Readiness Checklist

이 문서는 MiniPark Work OS POC를 공개 검증 상태로 만들기 위한 마지막 운영 체크리스트다.

## 현재 진행률

진행률: 99%

## 1. Supabase migration 적용

운영 Supabase SQL Editor 또는 CLI에서 다음 순서로 적용한다.

```text
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_auth_session_profiles.sql
supabase/migrations/0003_storage_work_files.sql
supabase/migrations/0004_task_archive.sql
```

이미 `0001`이 적용되어 있으면 `0002`부터 적용한다.

적용 후 확인:

```sql
\i supabase/verification.sql
```

Supabase SQL Editor를 사용할 때는 `supabase/verification.sql`의 내용을 붙여넣어 실행한다.

완료 기준:

- `profiles` insert policy 존재
- `audit_logs` insert policy 존재
- `work-files` private bucket 존재
- `tasks.archived_at`, `tasks.archived_by` 존재

## 2. Google OAuth 설정

Google Cloud OAuth Client:

```text
Authorized redirect URI:
https://alezurehpijkpdusjdsj.supabase.co/auth/v1/callback
```

Supabase Provider:

```text
Authentication > Providers > Google
Enabled: On
Client ID: Google Cloud OAuth Client ID
Client Secret: Google Cloud OAuth Client Secret
```

Supabase URL Configuration:

```text
Site URL:
https://workplan-collab-platform.vercel.app

Redirect URLs:
https://workplan-collab-platform.vercel.app/auth/callback
http://127.0.0.1:3000/auth/callback
http://127.0.0.1:3002/auth/callback
```

완료 기준:

- `/login`에서 Google 로그인 버튼 활성화
- 로그인 성공 후 `/dashboard`로 이동
- `profiles`에 로그인 사용자 row 생성
- 허용 도메인이 다르면 로그인 차단

## 3. Vercel 환경변수

Production과 Preview에 동일하게 설정한다.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=https://workplan-collab-platform.vercel.app
GOOGLE_WORKSPACE_DOMAIN
```

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 현재 앱 런타임에 필요하지 않다.
- Google Client Secret은 Vercel 앱 환경변수에 넣지 않고 Supabase Provider에만 저장한다.

## 4. 공개 POC smoke test

배포 후 다음 URL을 확인한다.

```text
https://workplan-collab-platform.vercel.app/api/integrations/health
https://workplan-collab-platform.vercel.app/login
https://workplan-collab-platform.vercel.app/dashboard
https://workplan-collab-platform.vercel.app/tasks
https://workplan-collab-platform.vercel.app/search
```

자동 확인:

```powershell
.\scripts\smoke-test.ps1
```

Preview 또는 다른 URL 확인:

```powershell
.\scripts\smoke-test.ps1 -BaseUrl "https://your-preview-url.vercel.app"
```

로컬에서 Supabase 환경변수 없이 화면 응답만 확인:

```powershell
.\scripts\smoke-test.ps1 -BaseUrl "http://localhost:3002" -AllowUnconfiguredSupabase
```

로그인 후 확인할 업무 흐름:

- 업무 생성
- 업무 상세 조회
- 상태 변경
- 본문 수정
- 담당자 배정
- 댓글 작성
- 첨부 업로드/다운로드
- 업무 보관
- 보관 업무 복구
- 통합검색 결과 이동

## 5. 남은 1%

예상 작업 시간:

- Supabase migration 적용: 15-25분
- Google OAuth 콘솔 설정: 20-40분
- Vercel 환경변수/재배포 확인: 10-20분
- 공개 POC smoke test: 30-45분

총 예상: 1.5-2시간
