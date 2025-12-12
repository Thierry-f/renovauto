@echo off
cd %~dp0

echo ================================
echo   RENOV'AUTO - Mise a jour
echo   (Windows)
echo ================================
echo.

REM Vérifier Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installe !
    echo Télécharger sur https://nodejs.org
    pause
    exit /b
)

REM Vérifier Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installe !
    echo Installer Git : https://git-scm.com/downloads
    pause
    exit /b
)

echo ▶ Génération des données véhicules...
node scripts\generateVoData.mjs
if %errorlevel% neq 0 (
    echo ❌ Erreur Node !
    pause
    exit /b
)

echo ▶ Ajout des fichiers...
git add vo assets/js/vo_data.js

echo ▶ Commit...
git commit -m "Mise a jour automatique des vehicules"

echo ▶ Push GitHub...
git push

echo.
echo ✅ Terminé ! Le site a été mis à jour.
pause