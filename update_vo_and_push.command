#!/bin/bash
# Génère assets/js/vo_data.js à partir du dossier vo/,
# puis fait un commit et un push sur GitHub.

cd "$(dirname "$0")"

echo "=== Rénov'auto – Actualisation des véhicules ==="

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js n'est pas installé. Installez-le d'abord sur https://nodejs.org/"
  exit 1
fi

if [ ! -d "vo" ]; then
  echo "❌ Aucun dossier 'vo' trouvé à la racine du projet."
  echo "Créez un dossier 'vo' puis un sous-dossier par véhicule."
  exit 1
fi

echo "▶ Génération de assets/js/vo_data.js..."
node scripts/generateVoData.mjs || { echo "❌ Erreur Node"; exit 1; }

echo "▶ Préparation du commit Git..."
git add vo assets/js/vo_data.js || true

git status

echo "▶ Message de commit (laisser vide pour valeur par défaut) :"
read -r msg
if [ -z "$msg" ]; then
  msg="Mise à jour des véhicules (vo_data.js)"
fi

git commit -m "$msg" || echo "Aucun changement à committer."

echo "▶ Envoi sur GitHub..."
git push

echo "✅ Terminé."
