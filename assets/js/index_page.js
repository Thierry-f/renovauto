document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("home-vo-list");
  if (!container || !Array.isArray(rawVehicles) || rawVehicles.length === 0) return;

  const normalized = rawVehicles.map((vo) => ({
    ...vo,
    mainImageUrl: vo.mainImageUrl || (vo.images && vo.images[0] ? `vo/${vo.folder}/${vo.images[0]}` : ""),
    badge: "Occasion du moment",
  }));

  // Mélange simple
  for (let i = normalized.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normalized[i], normalized[j]] = [normalized[j], normalized[i]];
  }

  const toShow = normalized.slice(0, 3);
  container.innerHTML = "";
  toShow.forEach((vo) => {
    const card = createVoCard(vo);
    container.appendChild(card);
  });
});
