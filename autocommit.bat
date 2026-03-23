@echo off
if "%~1"=="" (
    echo [ERROR] Usage: autocommit.bat "Your commit message"
    pause
    exit /b 1
)

:: Call PowerShell script to handle logic
powershell -ExecutionPolicy Bypass -File "%~dp0autocommit.ps1" -msg "%~1"
if %errorlevel% neq 0 (
    echo [ERROR] Task failed.
    pause
    exit /b 1
)

echo [SUCCESS] Done.
pause