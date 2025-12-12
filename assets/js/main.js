document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

/**
 * Crée une carte VO (liste / accueil)
 * @param {Object} vo
 * @returns {HTMLElement}
 */
function createVoCard(vo) {
  const card = document.createElement("article");
  card.className = "vo-card";

  const imgWrap = document.createElement("div");
  imgWrap.className = "vo-image-wrapper";
  const img = document.createElement("img");
  img.loading = "lazy";
  img.src = vo.mainImageUrl || "";
  img.alt = vo.title || "Véhicule d'occasion";
  imgWrap.appendChild(img);

  if (vo.badge) {
    const badge = document.createElement("div");
    badge.className = "vo-badge";
    badge.textContent = vo.badge;
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

  if (vo.year) {
    const span = document.createElement("span");
    span.textContent = String(vo.year);
    meta.appendChild(span);
  }
  if (vo.km) {
    const span = document.createElement("span");
    span.textContent = vo.km.toLocaleString("fr-FR") + " km";
    meta.appendChild(span);
  }
  if (vo.fuel) {
    const span = document.createElement("span");
    span.textContent = vo.fuel;
    meta.appendChild(span);
  }

  body.appendChild(title);
  body.appendChild(summary);
  if (meta.childElementCount > 0) body.appendChild(meta);

  const footer = document.createElement("div");
  footer.className = "vo-footer";

  const price = document.createElement("div");
  price.className = "vo-price";
  if (vo.price) price.textContent = vo.price.toLocaleString("fr-FR") + " €";
  else price.textContent = "Prix sur demande";

  const cta = document.createElement("a");
  cta.className = "vo-cta";
  cta.href = "vo.html?id=" + encodeURIComponent(vo.id);
  cta.textContent = "Voir la fiche";

  footer.appendChild(price);
  footer.appendChild(cta);

  card.appendChild(imgWrap);
  card.appendChild(body);
  card.appendChild(footer);

  return card;
}
