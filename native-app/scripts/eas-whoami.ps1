$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $appRoot
$node = Join-Path $repoRoot "tools\node-v24.16.0-win-x64\node.exe"
$eas = Join-Path $appRoot "node_modules\eas-cli\bin\run"

$env:EXPO_NO_TELEMETRY = "1"
$env:EXPO_HOME = Join-Path $appRoot ".expo-home"
$env:XDG_CONFIG_HOME = Join-Path $appRoot ".eas-home"
$env:PATH = (Join-Path $repoRoot "tools\node-v24.16.0-win-x64") + ";" + $env:PATH
New-Item -ItemType Directory -Force $env:EXPO_HOME | Out-Null
New-Item -ItemType Directory -Force $env:XDG_CONFIG_HOME | Out-Null

Set-Location $appRoot
& $node $eas whoami
