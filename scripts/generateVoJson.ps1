Set-Location $PSScriptRoot
Set-Location ".."   # on revient à la racine du projet

$voDir = Join-Path (Get-Location) "vo"
$voJsonPath = Join-Path $voDir "vo.json"

if (-not (Test-Path $voDir)) {
  Write-Host "❌ Dossier introuvable: $voDir"
  exit 1
}

function Get-InfoValue($lines, $keys) {
  foreach ($k in $keys) {
    $match = $lines | Where-Object { $_ -match "^\s*$k\s*:" } | Select-Object -First 1
    if ($match) {
      return ($match -replace "^\s*[^:]+:\s*", "").Trim()
    }
  }
  return ""
}

function To-Int($s) {
  if (-not $s) { return 0 }
  $digits = ($s -replace "[^\d]", "")
  if ([string]::IsNullOrWhiteSpace($digits)) { return 0 }
  return [int]$digits
}

$vehicles = @()

Get-ChildItem -Path $voDir -Directory | ForEach-Object {
  $folder = $_.Name
  $folderPath = $_.FullName

  $infoFile = Join-Path $folderPath "infos.txt"
  if (-not (Test-Path $infoFile)) {
    Write-Host "⚠️ infos.txt manquant dans vo\$folder (ignoré)"
    return
  }

  $lines = Get-Content -Path $infoFile -Encoding UTF8

  $titre = Get-InfoValue $lines @("Titre", "Title")
  $annee = To-Int (Get-InfoValue $lines @("Année", "Annee", "Year"))
  $km    = To-Int (Get-InfoValue $lines @("Kilométrage", "Kilometrage", "Km", "KM"))
  $prix  = To-Int (Get-InfoValue $lines @("Prix", "Price"))
  $options = Get-InfoValue $lines @("Options")
  $description = Get-InfoValue $lines @("Description", "Desc")

  # Photos: prend toutes les images du dossier (noms au hasard ok)
  $photos = Get-ChildItem -Path $folderPath -File |
    Where-Object { $_.Extension -match "^\.(jpg|jpeg|png|webp)$" -or $_.Extension -match "^\.(JPG|JPEG|PNG|WEBP)$" } |
    Sort-Object Name |
    ForEach-Object { "vo/$folder/$($_.Name)" }

  if (-not $photos -or $photos.Count -eq 0) {
    Write-Host "⚠️ aucune photo dans vo\$folder (ignoré)"
    return
  }

  # Nettoyage options: on garde une string (ton site sait spliter au besoin)
  # IMPORTANT: pas de retours ligne qui cassent JSON
  $options = ($options -replace "`r?`n", " ").Trim()
  $description = ($description -replace "`r?`n", " ").Trim()
  $titre = ($titre -replace "`r?`n", " ").Trim()

  $vehicles += [pscustomobject]@{
    slug = $folder
    titre = $titre
    annee = $annee
    km = $km
    prix = $prix
    photos = $photos
    options = $options
    description = $description
  }
}

# Ecrit vo.json (UTF-8 sans BOM)
$json = $vehicles | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($voJsonPath, $json, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "✅ vo.json généré : $voJsonPath"
Write-Host "✅ Véhicules : $($vehicles.Count)"
