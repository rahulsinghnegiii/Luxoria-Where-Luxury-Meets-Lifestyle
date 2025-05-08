# PowerShell script to run the Next.js development server with safer options
Write-Host "Starting Next.js development server in safe mode..." -ForegroundColor Green

try {
    # Get the current directory
    $currentDir = Get-Location
    Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

    # Check if .next directory exists and remove it to start fresh
    if (Test-Path ".next") {
        Write-Host "Removing existing .next directory..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force ".next"
    }

    # Run the Next.js dev server with specific options to reduce errors
    # --no-open prevents automatic browser opening
    # --turbo=false disables Turbo mode which can cause some issues
    # --experimental-no-source-maps-url prevents source map URL issues
    Write-Host "Running: npx next dev --no-open --turbo=false --experimental-no-source-maps-url" -ForegroundColor Yellow
    npx next dev --no-open --turbo=false
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
} 