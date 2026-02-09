@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

cd /d "%~dp0"

echo ==============================
echo   RENOVAUTO - PUSH GITHUB
echo ==============================

where git >nul 2>nul
if errorlevel 1 (
  echo Git non installe
  pause
  exit /b 1
)

if not exist ".git" (
  echo Pas de depot Git ici
  pause
  exit /b 1
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin git@github.com:thierry-f/renovauto.git
)

git checkout main 2>nul || git checkout -b main

git add -A

git rev-parse --verify HEAD >nul 2>nul
if errorlevel 1 (
  git commit -m "Initial commit Renovauto"
) else (
  git diff --cached --quiet || git commit -m "Mise a jour Renovauto"
)

git push -u origin main

pause
