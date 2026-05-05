document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  
  // Lancement du chargement automatique
  if (typeof initApp === 'function') initApp();
});

// Cette fonction va fusionner vos anciennes données et les nouvelles du CMS
async function getAllVehicles() {
  let allVehicles = [];
  
  // 1. On récupère les anciens (ceux de vo_data.js)
  if (typeof rawVehicles !== 'undefined') {
    allVehicles = [...rawVehicles];
  }

  // 2. On tente de récupérer les nouveaux via l'API GitHub (votre dossier admin)
  try {
    // REMPLACEZ 'Thierry-f' et 'renovauto' par vos vrais noms GitHub
    const response = await fetch('https://api.github.com/repos/Thierry-f/renovauto/contents/vo_data_auto');
    if (response.ok) {
      const files = await response.json();
      for (const file of files) {
        if (file.name.endsWith('.json') || file.name.endsWith('.md')) {
          const res = await fetch(file.download_url);
          const data = await res.json(); 
          allVehicles.push(data);
        }
      }
    }
  } catch (e) {
    console.log("Pas encore de nouveaux véhicules via Admin.");
  }
  
  return allVehicles;
}

function createVoCard(vo) {
  const card = document.createElement("article");
  card.className = "vo-card";

  const imgWrap = document.createElement("div");
  imgWrap.className = "vo-image-wrapper";
  const img = document.createElement("img");
  img.loading = "lazy";
  
  // Gestion intelligente du chemin de l'image
  let finalImg = vo.mainImageUrl || "";
  if (vo.folder && vo.images && vo.images[0]) {
      finalImg = `vo/${vo.folder}/${vo.images[0]}`;
  }
  img.src = finalImg;
  img.alt = vo.title || "Véhicule d'occasion";
  imgWrap.appendChild(img);

  if (vo.badge || vo.price < 5000) {
    const badge = document.createElement("div");
    badge.className = "vo-badge";
    badge.textContent = vo.badge || "Prix Web";
    imgWrap.appendChild(badge);
  }

  const body = document.createElement("div");
  body.className = "vo-body";

  const title = document.createElement("h3");
  title.className = "vo-title";
  title.textContent = vo.title || "Véhicule";

  const summary = document.createElement("p");
  summary.className = "vo-summary";
  summary.textContent = vo.summary || "";

  const meta = document.createElement("div");
  meta.className = "vo-meta";

  if (vo.year) meta.innerHTML += `<span>${vo.year}</span>`;
  if (vo.km) meta.innerHTML += `<span>${Number(vo.km).toLocaleString("fr-FR")} km</span>`;
  if (vo.fuel) meta.innerHTML += `<span>${vo.fuel}</span>`;

  body.appendChild(title);
  body.appendChild(summary);
  body.appendChild(meta);

  const footer = document.createElement("div");
  footer.className = "vo-footer";

  const price = document.createElement("div");
  price.className = "vo-price";
  price.textContent = vo.price ? `${Number(vo.price).toLocaleString("fr-FR")} €` : "Prix sur demande";

  const cta = document.createElement("a");
  cta.className = "vo-cta";
  cta.href = `vo.html?id=${vo.id}`;
  cta.textContent = "Détails";

  footer.appendChild(price);
  footer.appendChild(cta);
  body.appendChild(footer);
  card.appendChild(imgWrap);
  card.appendChild(body);

  return card;
}
