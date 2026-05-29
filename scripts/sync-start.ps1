param()

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "Fetching latest remote state..."
git fetch --prune

Write-Host "Updating current branch..."
git pull --rebase --autostash

Write-Host ""
git status --short --branch
Write-Host ""
Write-Host "Ready to work."
