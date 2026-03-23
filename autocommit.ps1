param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

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

# 4. Check & Update Remote (HTTPS -> SSH)
$remoteUrl = git remote get-url origin
if ($remoteUrl -like "http*") {
    Write-Host "[INFO] HTTPS detected. Switching to SSH..." -ForegroundColor Yellow
    git remote set-url origin git@github.com:9lucifer/9lucifer.github.io.git
}

# 5. Test SSH
Write-Host "[INFO] Testing SSH connection..." -ForegroundColor Cyan
$sshTest = ssh -T git@github.com 2>&1
if ($sshTest -notmatch "successfully authenticated") {
    Write-Host "[ERROR] SSH authentication failed. Please check:" -ForegroundColor Red
    Write-Host "1. Is ~/.ssh/id_rsa present?"
    Write-Host "2. Is the key added to GitHub?"
    exit 1
}

# 6. Push
Write-Host "[INFO] Pushing to origin main..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Push failed. Try manual: git push origin main" -ForegroundColor Red
    exit 1
}

Write-Host "`n[SUCCESS] ✓ Changes pushed to main branch." -ForegroundColor Green
Read-Host "Press Enter to exit..."