import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

const catalogDocument = doc(
  db,
  "catalogos",
  "entre-vinos-jardines"
);

export async function cargarCatalogoPublicado() {
  const snapshot = await getDoc(catalogDocument);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return data.settings || null;
}

export async function publicarCatalogo(settings) {
  if (!settings || typeof settings !== "object") {
    throw new Error("La configuración del catálogo no es válida.");
  }

  await setDoc(catalogDocument, {
    settings,
    updatedAt: serverTimestamp()
  });
}
