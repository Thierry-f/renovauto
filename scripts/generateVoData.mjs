import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const VO_DIR = path.join(ROOT, "vo");

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/**
 * Parse un fichier infos.txt simple sous forme:
 * cle = valeur
 * les options peuvent être multi-lignes après "options =" ou "options:".
 */
function parseInfos(content) {
  const data = {};
  const lines = content.split(/\r?\n/);
  let inOptions = false;
  const options = [];

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (!inOptions) {
      const lower = line.toLowerCase();
      if (lower.startsWith("options") && (line.includes("=") || line.includes(":"))) {
        inOptions = true;
        const idxEq = line.indexOf("=");
        const idxColon = line.indexOf(":");
        let idx = -1;
        if (idxEq !== -1 && idxColon !== -1) idx = Math.min(idxEq, idxColon);
        else idx = Math.max(idxEq, idxColon);
        const after = line.slice(idx + 1).trim();
        if (after) options.push(after);
        continue;
      }

      const idxEq = line.indexOf("=");
      const idxColon = line.indexOf(":");
      let idx = -1;
      if (idxEq !== -1 && idxColon !== -1) idx = Math.min(idxEq, idxColon);
      else idx = Math.max(idxEq, idxColon);

      if (idx === -1) continue;
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      if (!key) continue;
      data[key] = value;
    } else {
      options.push(line);
    }
  }

  if (options.length) data.options = options;
  return data;
}

async function main() {
  try {
    const entries = await fs.readdir(VO_DIR, { withFileTypes: true });
    const vehicles = [];

    for (const dirent of entries) {
      if (!dirent.isDirectory()) continue;
      const folder = dirent.name;
      const folderPath = path.join(VO_DIR, folder);

      const files = await fs.readdir(folderPath);
      const infosFile = files.find((f) => /^infos\.(txt|text)$/i.test(f));

      let infos = {};
      if (infosFile) {
        const content = await fs.readFile(path.join(folderPath, infosFile), "utf8");
        infos = parseInfos(content);
      }

      const images = files
        .filter((f) => IMAGE_EXT.includes(path.extname(f).toLowerCase()))
        .sort();

      const mainImage =
        (infos.mainimage || infos["main_image"] || infos["image_principale"]) &&
        images.includes(infos.mainimage || infos["main_image"] || infos["image_principale"])
          ? infos.mainimage || infos["main_image"] || infos["image_principale"]
          : images[0] || null;

      const cleanNumber = (val) => {
        if (!val) return null;
        const s = String(val).replace(/[^0-9]/g, "");
        return s ? Number(s) : null;
      };

      const vo = {
        id: infos.id || folder,
        folder,
        title: infos.title || infos.titre || `Véhicule ${folder}`,
        price: cleanNumber(infos.prix || infos.price),
        year: cleanNumber(infos.annee || infos.année || infos.year),
        km: cleanNumber(infos.km || infos.kilometrage || infos.kilométrage),
        fuel: infos.carburant || infos.fuel || null,
        gearbox: infos.boite || infos.boîte || infos.gearbox || null,
        power: infos.puissance || null,
        color: infos.couleur || infos.color || null,
        summary: infos.resume || infos.résumé || infos.summary || "",
        options: Array.isArray(infos.options) ? infos.options : [],
        images,
        mainImage,
      };

      vehicles.push(vo);
    }

    const outPath = path.join(ROOT, "assets/js/vo_data.js");
    const js = `// Fichier généré automatiquement. Ne pas modifier à la main.\nconst rawVehicles = ${JSON.stringify(
      vehicles,
      null,
      2
    )};\n`;
    await fs.writeFile(outPath, js, "utf8");

    console.log(`✔ vo_data.js généré avec ${vehicles.length} véhicule(s).`);
  } catch (err) {
    console.error("Erreur lors de la génération de vo_data.js :", err);
    process.exit(1);
  }
}

main();
