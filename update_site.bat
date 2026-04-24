@echo off
cd /d %~dp0

echo ==============================
echo   RENOVAUTO - MISE A JOUR
echo ==============================

echo.
echo [1/4] Generation des vehicules...
node scripts/generateVoData.mjs

echo.
echo [2/4] Ajout des fichiers...
git add -A

echo.
echo [3/4] Commit...
git diff --cached --quiet
IF %ERRORLEVEL% NEQ 0 (
    git commit -m "Mise a jour automatique des vehicules"
) ELSE (
    echo Aucun changement detecte
)

echo.
echo [4/4] Synchronisation avec GitHub...
git pull --rebase origin main
git push

echo.
echo ==============================
echo   SITE MIS A JOUR !
echo ==============================

pause