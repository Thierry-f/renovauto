Set-Location $PSScriptRoot

Write-Host "=== RENOV_AUTO - Mise a jour du site (Windows / PowerShell) ==="

# Verif Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "ERREUR: Git n'est pas installe ou pas dans le PATH."
  Write-Host "Installe-le sur https://git-scm.com"
  Pause
  exit 1
}

# Verif script generation
if (-not (Test-Path "scripts/generateVoJson.ps1")) {
  Write-Host "ERREUR: Fichier introuvable scripts/generateVoJson.ps1"
  Pause
  exit 1
}

Write-Host "Generation du fichier vo.json..."
powershell -ExecutionPolicy Bypass -File ".\scripts\generateVoJson.ps1"

if ($LASTEXITCODE -ne 0) {
  Write-Host "ERREUR pendant la generation de vo.json"
  Pause
  exit 1
}

Write-Host "Ajout des fichiers dans Git..."
git add -A

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "Aucun changement detecte"
} else {
  Write-Host "Commit..."
  git commit -m "Mise a jour automatique VO"
}

Write-Host "Push GitHub..."
git push

Write-Host "TERMINE."
Pause
