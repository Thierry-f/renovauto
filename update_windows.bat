@echo off
chcp 65001 >nul
cd /d %~dp0

echo ================================
echo   RENOV'AUTO - Mise a jour
echo   (Windows)
echo ================================
echo.

REM Vérification Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installe ou pas dans le PATH
    echo Télécharger sur https://nodejs.org
    pause
    exit /b
)

REM Vérification Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installe
    echo Télécharger sur https://git-scm.com
    pause
    exit /b
)

echo ▶ Génération des véhicules...
node scripts\generateVoData.mjs
if %errorlevel% neq 0 (
    echo ❌ Erreur Node
    pause
    exit /b
)

echo ▶ Ajout des fichiers...
git add vo assets\js\vo_data.js

echo ▶ Commit...
git commit -m "Mise a jour automatique des vehicules"

echo ▶ Push GitHub...
git push

echo.
echo ✅ Site mis a jour avec succes !
pause
