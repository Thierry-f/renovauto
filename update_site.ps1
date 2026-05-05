Clear-Host
Write-Host "=== RENOV AUTO - Mise a jour (Windows) ===" -ForegroundColor Cyan

# 0. Synchronisation avec GitHub
Write-Host "-> Recuperation des modifs de GitHub..." -ForegroundColor Yellow
git pull origin main --rebase

# 1. Verification Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERREUR: Node.js n'est pas installe !" -ForegroundColor Red
    pause ; exit
}

# 2. Generation des donnees
Write-Host "-> Generation des donnees vehicules..." -ForegroundColor Yellow
node scripts/generateVoData.mjs
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERREUR: Probleme script Node." -ForegroundColor Red
    pause ; exit 
}

# 3. Envoi vers GitHub
Write-Host "-> Envoi vers GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Mise a jour vehicules (PC + S26)"
git push origin main

Write-Host "`nDONE ! Tout est a jour." -ForegroundColor Green
Write-Host "Appuyez sur une touche pour fermer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")