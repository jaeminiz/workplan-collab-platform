param(
  [string]$BaseUrl = "https://workplan-collab-platform.vercel.app",
  [switch]$AllowUnconfiguredSupabase
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/integrations/health",
  "/login",
  "/dashboard",
  "/tasks",
  "/tasks/archive",
  "/search",
  "/settings"
)

Write-Host "Smoke testing $BaseUrl"
Write-Host ""

$failures = @()

foreach ($path in $paths) {
  $url = "$BaseUrl$path"

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5
    $status = [int]$response.StatusCode

    if ($status -ge 200 -and $status -lt 400) {
      Write-Host "[OK]   $status $path"
    } else {
      Write-Host "[FAIL] $status $path"
      $failures += "$path returned $status"
    }
  } catch {
    Write-Host "[FAIL] $path"
    Write-Host "       $($_.Exception.Message)"
    $failures += "$path failed"
  }
}

Write-Host ""

try {
  $health = Invoke-RestMethod -Uri "$BaseUrl/api/integrations/health"
  Write-Host "Health:"
  Write-Host "  Supabase configured: $($health.supabaseConfigured)"
  Write-Host "  App URL: $($health.appUrl)"
  Write-Host "  Required migrations: $($health.requiredMigrations -join ', ')"

  if (-not $health.supabaseConfigured -and -not $AllowUnconfiguredSupabase) {
    $failures += "Supabase environment is not configured"
  }

  if (-not $health.appUrl) {
    $failures += "App URL is not reported by health check"
  }
} catch {
  $failures += "Health JSON check failed"
}

Write-Host ""

if ($AllowUnconfiguredSupabase) {
  Write-Host "[SKIP] Google OAuth provider redirect"
} else {
  try {
    Invoke-WebRequest -Uri "$BaseUrl/auth/sign-in" -MaximumRedirection 5 -UseBasicParsing | Out-Null
    Write-Host "[OK]   Google OAuth provider redirect"
  } catch {
    $message = $_.ErrorDetails.Message

    if (-not $message) {
      $message = $_.Exception.Message
    }

    Write-Host "[FAIL] Google OAuth provider redirect"
    Write-Host "       $message"
    $failures += "Google OAuth provider redirect failed"
  }
}

Write-Host ""

if ($failures.Count -gt 0) {
  Write-Host "Smoke test failed:"
  $failures | ForEach-Object { Write-Host "  - $_" }
  exit 1
}

Write-Host "Smoke test passed."
