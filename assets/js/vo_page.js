document.addEventListener("DOMContentLoaded", () => {
  if (!Array.isArray(rawVehicles)) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const root = document.getElementById("vo-detail-root");
  if (!root) return;

  const vo = rawVehicles.find((v) => String(v.id) === String(id));
  if (!vo) {
    root.innerHTML = "<p>Véhicule introuvable.</p>";
    return;
  }

  const images = (vo.images && vo.images.length ? vo.images : []).map(
    (img) => `vo/${vo.folder}/${img}`
  );
  const mainImageUrl = vo.mainImageUrl || (images[0] || "");

  const card = document.createElement("div");
  card.className = "vo-detail-card";

  const media = document.createElement("div");
  media.className = "vo-detail-media";

  const mainImgWrap = document.createElement("div");
  mainImgWrap.className = "vo-detail-main-image";
  const mainImg = document.createElement("img");
  mainImg.src = mainImageUrl;
  mainImg.alt = vo.title || "Véhicule d'occasion";
  mainImgWrap.appendChild(mainImg);

  const thumbs = document.createElement("div");
  thumbs.className = "vo-detail-thumbs";

  images.forEach((src, index) => {
    const th = document.createElement("button");
    th.type = "button";
    th.className = "vo-detail-thumb" + (index === 0 ? " active" : "");
    const img = document.createElement("img");
    img.src = src;
    img.alt = vo.title || "";
    th.appendChild(img);
    th.addEventListener("click", () => {
      mainImg.src = src;
      document
        .querySelectorAll(".vo-detail-thumb")
        .forEach((el) => el.classList.remove("active"));
      th.classList.add("active");
    });
    thumbs.appendChild(th);
  });

  media.appendChild(mainImgWrap);
  if (images.length > 1) media.appendChild(thumbs);

  const info = document.createElement("div");
  info.className = "vo-detail-info";

  const titleRow = document.createElement("div");
  titleRow.className = "vo-detail-title-row";

  const title = document.createElement("h1");
  title.className = "vo-detail-title";
  title.textContent = vo.title || "Véhicule";

  const price = document.createElement("div");
  price.className = "vo-detail-price";
  if (vo.price) price.textContent = vo.price.toLocaleString("fr-FR") + " €";
  else price.textContent = "Prix sur demande";

  // Texte sous le prix
const priceSub = document.createElement("div");
priceSub.className = "vo-price-sub";
priceSub.textContent = "Prix hors frais d’immatriculation";

  titleRow.appendChild(title);
  const priceBlock = document.createElement("div");
priceBlock.style.display = "flex";
priceBlock.style.flexDirection = "column";
priceBlock.style.alignItems = "flex-end";
priceBlock.appendChild(price);
priceBlock.appendChild(priceSub);

titleRow.appendChild(priceBlock);

  const metaGrid = document.createElement("div");
  metaGrid.className = "vo-detail-meta-grid";

  function addMeta(label, value) {
    if (value == null || value === "") return;
    const wrap = document.createElement("span");
    const lab = document.createElement("span");
    lab.className = "vo-detail-meta-label";
    lab.textContent = label;
    const val = document.createElement("span");
    val.textContent = value;
    wrap.appendChild(lab);
    wrap.appendChild(val);
    metaGrid.appendChild(wrap);
  }

  addMeta("Année", vo.year || "");
  addMeta("Kilométrage", vo.km != null ? vo.km.toLocaleString("fr-FR") + " km" : "");
  addMeta("Carburant", vo.fuel || "");
  addMeta("Boîte", vo.gearbox || "");
  addMeta("Puissance", vo.power || "");
  addMeta("Couleur", vo.color || "");

  const desc = document.createElement("div");
  desc.className = "vo-detail-description";
  desc.textContent = vo.summary || "";

  // --- Boutons Appel / WhatsApp ---
const contactBox = document.createElement("div");
contactBox.className = "vo-contact";

const callBtn = document.createElement("a");
callBtn.className = "btn-call";
callBtn.href = "tel:0614031303";
callBtn.textContent = "📞 Appeler";

const whatsappBtn = document.createElement("a");
whatsappBtn.className = "btn-whatsapp";
whatsappBtn.href = "https://wa.me/33614031303";
whatsappBtn.target = "_blank";
whatsappBtn.textContent = "💬 WhatsApp";

contactBox.appendChild(callBtn);
contactBox.appendChild(whatsappBtn);

  const optionsBlock = document.createElement("div");
  optionsBlock.className = "vo-detail-options";

  const optTitle = document.createElement("div");
  optTitle.className = "vo-detail-options-title";
  optTitle.textContent = "Options :";

  const optionNote = document.createElement("div");
optionNote.className = "vo-option-note";
optionNote.textContent = "Liste à titre indicatif";

  const optList = document.createElement("ul");
  const options = Array.isArray(vo.options) ? vo.options : [];
  options.forEach((opt) => {
    const li = document.createElement("li");
    li.textContent = opt;
    optList.appendChild(li);
  });

  let expanded = false;
  if (options.length > 5) {
    for (let i = 5; i < options.length; i++) {
      optList.children[i].style.display = "none";
    }
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "options-toggle";
    toggle.textContent = "Afficher plus ▼";
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      for (let i = 5; i < options.length; i++) {
        optList.children[i].style.display = expanded ? "" : "none";
      }
      toggle.textContent = expanded ? "Afficher moins ▲" : "Afficher plus ▼";
    });
    optionsBlock.appendChild(optTitle);
    optionsBlock.appendChild(optionNote);
    optionsBlock.appendChild(optList);
    optionsBlock.appendChild(toggle);
  } else if (options.length > 0) {
    optionsBlock.appendChild(optTitle);
    optionsBlock.appendChild(optList);
  }

  info.appendChild(titleRow);
  info.appendChild(metaGrid);
  if (vo.summary) info.appendChild(desc);
  info.appendChild(contactBox);
  if (options.length > 0) info.appendChild(optionsBlock);

  card.appendChild(media);
  card.appendChild(info);
  root.innerHTML = "";
  root.appendChild(card);
});
