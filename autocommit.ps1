param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

$githubHttpsUrl = "https://9lucifer@github.com/9lucifer/9lucifer.github.io.git"

# 1. Check for changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "[INFO] No changes detected. Skipping." -ForegroundColor Cyan
    exit 0
}

# 2. git add
Write-Host "[INFO] Staging files..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] git add failed." -ForegroundColor Red
    exit 1
}

# 3. git commit
Write-Host "[INFO] Committing: $msg" -ForegroundColor Cyan
git commit -m "$msg"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] git commit failed." -ForegroundColor Red
    exit 1
}

# 4. Test remote connectivity
Write-Host "[INFO] Testing GitHub HTTPS connection..." -ForegroundColor Cyan
git ls-remote $githubHttpsUrl HEAD | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Remote connectivity test failed." -ForegroundColor Red
    Write-Host "Please confirm Git Credential Manager can access GitHub."
    exit 1
}

# 5. Sync before push
Write-Host "[INFO] Rebasing from GitHub main..." -ForegroundColor Cyan
git pull --rebase $githubHttpsUrl main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] git pull --rebase failed." -ForegroundColor Red
    exit 1
}

# 6. Push
Write-Host "[INFO] Pushing to GitHub main..." -ForegroundColor Cyan
git push $githubHttpsUrl HEAD:main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Push failed. Try manual: git push $githubHttpsUrl HEAD:main" -ForegroundColor Red
    exit 1
}

Write-Host "`n[SUCCESS] ✓ Changes pushed to main branch." -ForegroundColor Green
Read-Host "Press Enter to exit..."
