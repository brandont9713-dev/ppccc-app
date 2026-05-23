$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $appRoot
$node = Join-Path $repoRoot "tools\node-v24.16.0-win-x64\node.exe"
$expo = Join-Path $appRoot "node_modules\expo\bin\cli"

$env:EXPO_NO_TELEMETRY = "1"
$env:EXPO_HOME = Join-Path $appRoot ".expo-home"
New-Item -ItemType Directory -Force $env:EXPO_HOME | Out-Null

Set-Location $appRoot
& $node $expo start --lan
