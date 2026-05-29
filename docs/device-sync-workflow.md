# Device Sync Workflow

이 프로젝트는 GitHub 저장소를 기준으로 데스크탑, 노트북, 휴대폰 Codex 작업을 동기화한다.

## Shared Repository

- Repository: `https://github.com/jaeminiz/workplan-collab-platform`
- Default branch: `master`
- Local laptop path: `D:\codex\workplan-collab-platform`

## Desktop and Laptop

작업을 시작하기 전에 최신 원격 상태를 받는다.

```powershell
cd D:\codex\workplan-collab-platform
.\scripts\sync-start.ps1
```

작업을 마친 뒤에는 커밋 메시지를 지정해 원격 저장소까지 업로드한다.

```powershell
.\scripts\sync-finish.ps1 "작업 내용 요약"
```

## Phone Codex

휴대폰에서는 로컬 PC 파일에 직접 접근하지 않고 GitHub 저장소를 기준으로 작업을 지시한다.

휴대폰에서 Codex에 작업을 맡길 때는 다음 정보를 함께 전달한다.

```text
Repository: https://github.com/jaeminiz/workplan-collab-platform
Branch: master
요청: 작업 내용
완료 후: commit and push
```

휴대폰에서 작업한 뒤 데스크탑이나 노트북에서 이어서 작업하려면 먼저 최신 변경을 받는다.

```powershell
.\scripts\sync-start.ps1
```

## Required Habit

- 작업 시작: `sync-start.ps1`
- 작업 종료: `sync-finish.ps1`
- 다른 기기에서 이어가기 전: `sync-start.ps1`

한 기기에서 commit만 하고 push하지 않은 변경은 다른 기기에서 받을 수 없다. 휴대폰 작업도 GitHub에 commit과 push가 끝난 뒤에만 데스크탑과 노트북으로 이어받을 수 있다.

## Conflict Rule

같은 파일을 두 기기에서 동시에 수정하지 않는다. 충돌이 발생하면 한 기기에서 먼저 해결하고 push한 뒤, 다른 기기에서 `sync-start.ps1`을 다시 실행한다.
