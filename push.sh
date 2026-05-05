#!/data/data/com.termux/files/usr/bin/bash

cd ~/renovauto

git add -A
git diff --cached --quiet || git commit -m "Mise à jour depuis Samsung"
git pull --rebase origin main
git push origin main

echo "OK SITE MIS A JOUR"

