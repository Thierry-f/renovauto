#!/bin/bash
cd "$(dirname "$0")"

echo "=== RÉNOV'AUTO – Mise à jour du site (macOS) ==="

# Vérification Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js n'est pas installé !"
  echo "Télécharger sur https://nodejs.org"
  exit 1
fi

# Vérification Git
if ! command -v git >/dev/null 2>&1; then
  echo "❌ Git n'est pas installé !"
  echo "Installer Xcode Command Line Tools :"
  echo "   xcode-select --install"
  exit 1
fi

echo "▶ Génération des données véhicules..."
node scripts/generateVoData.mjs || { echo "❌ Erreur Node"; exit 1; }

echo "▶ Ajout des fichiers..."
git add vo assets/js/vo_data.js

echo "▶ Commit..."
git commit -m "Mise à jour automatique des véhicules" || echo "Aucun changement détecté"

echo "▶ Push GitHub..."
git push

echo "✅ Terminé ! Le site est à jour."
read -n 1 -s -r -p "Appuyez sur une touche pour fermer..."