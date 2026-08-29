# ================================================================
# MusicFlow — Full Stack Dev Startup Script (Windows PowerShell)
# Run this from the project root: .\start-dev.ps1
# ================================================================

$ProjectRoot = $PSScriptRoot

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  MusicFlow Dev Environment Startup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Check MongoDB ─────────────────────────────────────────
$mongoPath = $null
$possibleMongoPaths = @(
    "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
    "C:\mongodb\bin\mongod.exe",
    "C:\mongodb-win32-x86_64-windows\bin\mongod.exe"
)

foreach ($p in $possibleMongoPaths) {
    if (Test-Path $p) { $mongoPath = $p; break }
}

# Also check PATH
if (-not $mongoPath) {
    $mongodCmd = Get-Command mongod -ErrorAction SilentlyContinue
    if ($mongodCmd) { $mongoPath = $mongodCmd.Source }
}

if ($mongoPath) {
    Write-Host "[1/3] MongoDB found: $mongoPath" -ForegroundColor Green

    # Check if already running
    $mongoRunning = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
    if ($mongoRunning) {
        Write-Host "      MongoDB already running on port 27017" -ForegroundColor Green
    } else {
        New-Item -ItemType Directory -Force -Path "C:\data\db" | Out-Null
        New-Item -ItemType Directory -Force -Path "C:\data\log" | Out-Null
        Write-Host "      Starting MongoDB..." -ForegroundColor Yellow
        Start-Process -FilePath $mongoPath `
            -ArgumentList "--dbpath C:\data\db --logpath C:\data\log\mongod.log --logappend" `
            -WindowStyle Hidden
        Start-Sleep -Seconds 2
        Write-Host "      MongoDB started on port 27017" -ForegroundColor Green
    }
} else {
    Write-Host "[1/3] MongoDB NOT found." -ForegroundColor Red
    Write-Host "      Please install MongoDB Community:" -ForegroundColor Yellow
    Write-Host "      winget install MongoDB.Server" -ForegroundColor White
    Write-Host "      Or use Docker: docker run -d -p 27017:27017 --name mongo mongo:7" -ForegroundColor White
    Write-Host ""
    $cont = Read-Host "Continue anyway? (y/N)"
    if ($cont -ne 'y') { exit 1 }
}

# ── 2. Seed database ─────────────────────────────────────────
Write-Host ""
Write-Host "[2/3] Seeding database..." -ForegroundColor Cyan
Set-Location "$ProjectRoot\backend"

$seedResult = npm run seed 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "      Seed failed (may already be seeded, continuing)" -ForegroundColor Yellow
}

# ── 3. Launch dev servers ─────────────────────────────────────
Write-Host ""
Write-Host "[3/3] Starting development servers..." -ForegroundColor Cyan
Write-Host ""

# Backend in new terminal window
Write-Host "  -> Backend  : http://localhost:5000/api/v1/health" -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot\backend'; Write-Host 'Backend starting...' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 1

# Frontend in new terminal window
Write-Host "  -> Frontend : http://localhost:5173" -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot\frontend'; Write-Host 'Frontend starting...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  Both servers launched!" -ForegroundColor Green
Write-Host "  Open: http://localhost:5173" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
