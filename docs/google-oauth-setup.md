# Google OAuth Setup

## 현재 코드 상태

앱에는 Supabase Auth 기반 Google OAuth 라우트가 준비되어 있습니다.

- `GET /auth/sign-in`
- `GET /auth/callback`
- `POST /auth/sign-out`

로그인 성공 후에는 `profiles` row를 자동 생성/갱신하고, `GOOGLE_WORKSPACE_DOMAIN`이 설정된 경우 해당 도메인의 계정만 허용합니다.

## 사용자가 해야 하는 콘솔 작업

### 1. Google Cloud OAuth Client 생성

Google Cloud Console에서 OAuth Client를 생성합니다.

Authorized redirect URI:

```text
https://alezurehpijkpdusjdsj.supabase.co/auth/v1/callback
```

### 2. Supabase Google Provider 활성화

Supabase Dashboard에서:

```text
Authentication > Providers > Google
```

설정값:

- Enabled: On
- Client ID: Google Cloud에서 발급
- Client Secret: Google Cloud에서 발급

### 3. Supabase URL Configuration

Authentication URL 설정:

```text
Site URL:
https://workplan-collab-platform.vercel.app

Redirect URLs:
https://workplan-collab-platform.vercel.app/auth/callback
http://127.0.0.1:3000/auth/callback
http://127.0.0.1:3002/auth/callback
```

## 주의

Google Client Secret은 GitHub나 문서에 저장하지 않습니다.

## 검증

1. `/login` 접속
2. Google 계정으로 계속 클릭
3. Supabase callback 이후 `/dashboard` 이동 확인
4. Supabase SQL Editor에서 profile 생성 확인

```sql
select id, email, display_name, created_at
from public.profiles
order by created_at desc
limit 5;
```
