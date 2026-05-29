# Deployment Status

## Vercel

공개 POC URL:

```text
https://workplan-collab-platform.vercel.app
```

상태:

- GitHub 저장소 연결 완료
- Production 배포 완료
- Supabase 환경변수 연결 완료

## Supabase

프로젝트:

```text
minipark-work-os-poc
```

프로젝트 URL:

```text
https://alezurehpijkpdusjdsj.supabase.co
```

상태:

- Free organization 생성 완료
- Free project 생성 완료
- Region: Southeast Asia, Singapore
- Data API 활성화
- Automatically expose new tables 비활성화
- Automatic RLS 활성화
- 초기 migration 적용 완료
- Seed 데이터 적용 완료

Seed row count:

```text
customers: 5
projects: 3
tasks: 4
task_comments: 2
```

## 다음 작업

1. Google OAuth provider 설정
2. `0002_auth_session_profiles.sql` 운영 DB 적용
3. `0003_storage_work_files.sql` 운영 DB 적용
4. `0004_task_archive.sql` 운영 DB 적용
5. 공개 POC smoke test 재실행

현재 확인된 차단:

```text
Supabase Google Provider is not enabled.
```

상세 절차:

```text
docs/production-readiness-checklist.md
```
