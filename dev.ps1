# PowerShell script to run the Next.js development server
Write-Host "Starting Next.js development server..." -ForegroundColor Green

try {
    # Get the current directory
    $currentDir = Get-Location
    Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

    # Run the Next.js dev server with a specific port
    # This syntax works better in PowerShell than chaining commands with &&
    Write-Host "Running: npm run dev" -ForegroundColor Yellow
    npm run dev
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
} 