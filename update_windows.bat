@echo off
setlocal enabledelayedexpansion

REM === RÉNOV'AUTO – Mise à jour du site (Windows) ===
chcp 65001 >nul

cd /d "%~dp0"

echo === RÉNOV'AUTO – Mise à jour du site (Windows) ===

REM --- Vérif Node ---
where node >nul 2>nul
if errorlevel 1 (
  echo ❌ Node.js n'est pas installe ou pas dans le PATH.
  echo Télécharge sur https://nodejs.org
  pause
  exit /b 1
)

REM --- Vérif Git ---
where git >nul 2>nul
if errorlevel 1 (
  echo ❌ Git n'est pas installe ou pas dans le PATH.
  echo Télécharge sur https://git-scm.com
  pause
  exit /b 1
)

REM --- Génération VO ---
echo ▶ Génération des données véhicules...
if not exist "scripts\generateVoData.mjs" (
  echo ❌ Fichier introuvable: scripts\generateVoData.mjs
  echo Vérifie que le dossier "scripts" existe bien dans ce projet.
  pause
  exit /b 1
)

node "scripts\generateVoData.mjs"
if errorlevel 1 (
  echo ❌ Erreur Node pendant la generation.
  pause
  exit /b 1
)

REM --- Git add/commit/push ---
echo ▶ Ajout des fichiers...
git add -A

REM Commit seulement si nécessaire
git diff --cached --quiet
if %errorlevel%==0 (
  echo Aucun changement détecté
) else (
  echo ▶ Commit...
  git commit -m "Mise a jour automatique des vehicules"
)

echo ▶ Push GitHub...
git push

echo ✅ Site mis a jour avec succes !
pause
