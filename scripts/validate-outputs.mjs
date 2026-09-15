import { existsSync } from "node:fs";
import { resolve } from "node:path";

const requiredFiles = [
  "index.html",
  "productos.html",
  "servicios.html",
  "nosotros.html",
  "contacto.html",
  "login.html",
  "panel.html",
  "styles.css",
  "script.js"
];

const root = resolve("outputs");
const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));

if (missing.length) {
  console.error(`Faltan archivos en outputs: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("outputs listo para publicar.");
