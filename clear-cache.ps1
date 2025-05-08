# PowerShell script to clear Next.js cache and resolve build issues

Write-Host "Clearing Next.js cache and node_modules problematic files..." -ForegroundColor Green

# Stop any running Next.js servers
try {
    $nextProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "next" }
    if ($nextProcess) {
        Write-Host "Stopping Next.js server..." -ForegroundColor Yellow
        Stop-Process -Id $nextProcess.Id -Force
    }
} catch {
    Write-Host "No Next.js server running. Continuing..." -ForegroundColor Cyan
}

# Get the current directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

# Remove Next.js cache directories
Write-Host "Removing Next.js cache directories..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path ".next-cache") {
    Remove-Item -Recurse -Force ".next-cache"
}
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
}

# Run npm commands to clean caches
Write-Host "Running npm cache clean..." -ForegroundColor Yellow
npm cache clean --force

# Clear browser caches (informational)
Write-Host "Please also clear your browser cache for localhost:3000" -ForegroundColor Magenta
Write-Host "In Chrome: Open DevTools > Application > Clear Storage > Clear site data" -ForegroundColor Magenta

# Reinstall dependencies (optional)
$reinstall = Read-Host "Do you want to reinstall node_modules? (y/n)"
if ($reinstall -eq "y") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
    }
    
    Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Cache cleanup complete!" -ForegroundColor Green
Write-Host "To restart the development server, run: npm run dev" -ForegroundColor Cyan 