$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $appRoot
$node = Join-Path $repoRoot "tools\node-v24.16.0-win-x64\node.exe"
$supabase = Join-Path $appRoot "node_modules\supabase\dist\supabase.js"
$localHome = Join-Path $appRoot ".supabase-home"

$env:PATH = (Join-Path $repoRoot "tools\node-v24.16.0-win-x64") + ";" + $env:PATH
$env:HOME = $localHome
$env:USERPROFILE = $localHome
$env:APPDATA = $localHome
$env:LOCALAPPDATA = $localHome
$tokenFile = Join-Path $appRoot ".supabase-token"
if (Test-Path $tokenFile) {
  $env:SUPABASE_ACCESS_TOKEN = (Get-Content $tokenFile -Raw).Trim()
}
New-Item -ItemType Directory -Force $localHome | Out-Null

Set-Location $appRoot

$projectRef = "lwrnoexybfqykfvxgjjs"
$publicFunctions = @(
  "get-teamup-events",
  "submit-app-form",
  "register-push-token"
)

$authenticatedFunctions = @(
  "send-kids-korral-alert",
  "send-live-now",
  "link-family-number",
  "upsert-app-event",
  "delete-app-event",
  "upsert-media-item"
)

foreach ($fn in $publicFunctions) {
  Write-Host "Deploying public function $fn..."
  & $node $supabase functions deploy $fn --project-ref $projectRef --no-verify-jwt
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to deploy $fn"
  }
}

foreach ($fn in $authenticatedFunctions) {
  Write-Host "Deploying authenticated function $fn..."
  & $node $supabase functions deploy $fn --project-ref $projectRef
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to deploy $fn"
  }
}
