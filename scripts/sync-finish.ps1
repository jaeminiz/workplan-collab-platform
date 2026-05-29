param(
  [Parameter(Mandatory = $true)]
  [string]$Message
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "Fetching latest remote state..."
git fetch --prune

Write-Host "Rebasing local work on latest remote state..."
git pull --rebase --autostash

git add -A
$changes = git status --porcelain

if (-not $changes) {
  Write-Host ""
  Write-Host "No local changes to commit."
  git status --short --branch
  exit 0
}

Write-Host "Creating commit..."
git commit -m $Message

Write-Host "Pushing to origin..."
git push

Write-Host ""
git status --short --branch
Write-Host ""
Write-Host "Sync complete."
