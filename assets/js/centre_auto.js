document.addEventListener("DOMContentLoaded", () => {
  if (!Array.isArray(rawVehicles)) return;

  const listContainer = document.getElementById("vo-list");
  const countEl = document.getElementById("vo-count");
  const emptyEl = document.getElementById("vo-empty");

  const priceMinInput = document.getElementById("price-min");
  const priceMaxInput = document.getElementById("price-max");
  const kmMaxInput = document.getElementById("km-max");
  const yearMinInput = document.getElementById("year-min");
  const fuelSelect = document.getElementById("fuel");
  const sortSelect = document.getElementById("sort-by");
  const applyBtn = document.getElementById("apply-filters");
  const resetBtn = document.getElementById("reset-filters");

  const normalized = rawVehicles.map((vo) => ({
    ...vo,
    mainImageUrl: vo.mainImageUrl || (vo.images && vo.images[0] ? `vo/${vo.folder}/${vo.images[0]}` : ""),
  }));

  function applyFiltersAndSort() {
    let list = normalized.slice();

    const priceMin = Number(priceMinInput.value) || null;
    const priceMax = Number(priceMaxInput.value) || null;
    const kmMax = Number(kmMaxInput.value) || null;
    const yearMin = Number(yearMinInput.value) || null;
    const fuel = fuelSelect.value || "";

    list = list.filter((vo) => {
      const price = vo.price != null ? Number(vo.price) : null;
      const km = vo.km != null ? Number(vo.km) : null;
      const year = vo.year != null ? Number(vo.year) : null;

      if (priceMin !== null && price !== null && price < priceMin) return false;
      if (priceMax !== null && price !== null && price > priceMax) return false;
      if (kmMax !== null && km !== null && km > kmMax) return false;
      if (yearMin !== null && year !== null && year < yearMin) return false;
      if (fuel && vo.fuel && vo.fuel !== fuel) return false;
      return true;
    });

    const sort = sortSelect.value;
    list.sort((a, b) => {
      const pa = a.price ?? 0;
      const pb = b.price ?? 0;
      const ka = a.km ?? 0;
      const kb = b.km ?? 0;
      const ya = a.year ?? 0;
      const yb = b.year ?? 0;

      switch (sort) {
        case "price-asc": return pa - pb;
        case "price-desc": return pb - pa;
        case "km-asc": return ka - kb;
        case "km-desc": return kb - ka;
        case "year-desc": return yb - ya;
        case "year-asc": return ya - yb;
        default: return 0;
      }
    });

    renderList(list);
  }

  function renderList(list) {
    listContainer.innerHTML = "";

    const total = normalized.length;
    const n = list.length;
    if (countEl) {
      if (!total) {
        countEl.textContent = "Aucun véhicule à afficher.";
      } else if (n === total) {
        countEl.textContent = `${n} véhicule${n > 1 ? "s" : ""} actuellement en vente.`;
      } else {
        countEl.textContent = `${n} véhicule${n > 1 ? "s" : ""} sur ${total} affiché${n > 1 ? "s" : ""}.`;
      }
    }

    if (!n) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }
    if (emptyEl) emptyEl.classList.add("hidden");

    list.forEach((vo) => {
      const card = createVoCard(vo);
      listContainer.appendChild(card);
    });
  }

  applyBtn?.addEventListener("click", applyFiltersAndSort);
  resetBtn?.addEventListener("click", () => {
    priceMinInput.value = "";
    priceMaxInput.value = "";
    kmMaxInput.value = "";
    yearMinInput.value = "";
    fuelSelect.value = "";
    sortSelect.value = "price-asc";
    renderList(normalized);
  });

  renderList(normalized);
});
