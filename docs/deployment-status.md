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
2. Seed 데이터 입력
3. mock repository를 Supabase repository로 교체
4. 업무 생성 dry-run을 실제 insert로 전환
5. 검색을 PostgreSQL Full Text Search로 연결
