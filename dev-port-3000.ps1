# PowerShell script to run the Next.js development server on port 3000
Write-Host "Starting Next.js development server on port 3000..." -ForegroundColor Green

try {
    # Get the current directory
    $currentDir = Get-Location
    Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

    # Run the Next.js dev server with port 3000
    Write-Host "Running: npx next dev -p 3000" -ForegroundColor Yellow
    npx next dev -p 3000
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
} 