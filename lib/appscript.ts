import { fallbackProducts, type Product } from "./fallback-products";

const APPSCRIPT_URL = process.env.APPSCRIPT_URL;
const APPSCRIPT_TOKEN = process.env.APPSCRIPT_TOKEN;

type ProductInput = Omit<Product, "id" | "fecha_creacion"> & { id?: string };
type AppScriptPayload = Record<string, unknown> & { action?: string };
export type CatalogCategory = {
  nombre: string;
  orden?: number;
  activo?: boolean;
};

async function callAppsScript<T>(payload: AppScriptPayload): Promise<T> {
  if (!APPSCRIPT_URL) throw new Error("APPSCRIPT_URL no configurada");
  if (!APPSCRIPT_TOKEN) throw new Error("APPSCRIPT_TOKEN no configurado");

  const response = await fetch(APPSCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token: APPSCRIPT_TOKEN, ...payload }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(formatAppsScriptError({
      action: payload.action,
      status: response.status,
      error: data?.error
    }));
  }
  if (data?.ok === false) {
    throw new Error(formatAppsScriptError({
      action: payload.action,
      error: data.error
    }));
  }
  if (!data) {
    throw new Error("Apps Script no devolvió una respuesta válida. Revisa la implementación publicada de la Web App.");
  }
  return data as T;
}

export async function listProducts({ includeInactive = false } = {}): Promise<Product[]> {
  const localProducts = sortProducts(includeInactive ? fallbackProducts : fallbackProducts.filter((p) => p.activo));
  if (!APPSCRIPT_URL) return localProducts;

  const url = new URL(APPSCRIPT_URL);
  url.searchParams.set("action", "listar");
  if (includeInactive) url.searchParams.set("token", APPSCRIPT_TOKEN || "");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return localProducts;
  const data = await response.json();
  const products = Array.isArray(data) ? data : data.products || [];
  return sortProducts(includeInactive ? products : products.filter((p: Product) => p.activo));
}

export async function createProduct(product: ProductInput) {
  return callAppsScript<{ ok: boolean; product: Product }>({ action: "crear", product });
}

export async function listCategories(products: Product[] = []): Promise<string[]> {
  const fallbackCategories = uniqueCategories(products);
  if (!APPSCRIPT_URL || !APPSCRIPT_TOKEN) return fallbackCategories;

  const url = new URL(APPSCRIPT_URL);
  url.searchParams.set("action", "listar_categorias");
  url.searchParams.set("token", APPSCRIPT_TOKEN);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallbackCategories;
    const data = await response.json();
    const categories = Array.isArray(data) ? data : data.categories || [];
    const labels = categories
      .map((category: CatalogCategory | string) => typeof category === "string" ? category : category.nombre)
      .filter(Boolean);
    return labels.length ? labels : uniqueCategories(products);
  } catch {
    return fallbackCategories;
  }
}

export async function createCategory(nombre: string) {
  return callAppsScript<{ ok: boolean; category: CatalogCategory }>({ action: "crear_categoria", category: { nombre } });
}

export async function renameCategory(nombre: string, nuevoNombre: string) {
  return callAppsScript<{ ok: boolean; category: CatalogCategory }>({
    action: "renombrar_categoria",
    nombre,
    nuevoNombre
  });
}

export async function deleteCategory(nombre: string) {
  return callAppsScript<{ ok: boolean }>({ action: "eliminar_categoria", nombre });
}

export async function updateProduct(id: string, product: Partial<Product>) {
  return callAppsScript<{ ok: boolean; product: Product }>({ action: "actualizar", id, product });
}

export async function deactivateProduct(id: string) {
  return callAppsScript<{ ok: boolean }>({ action: "eliminar", id });
}

export async function uploadProductImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const payload = {
    action: "subir_imagen",
    nombreArchivo: file.name,
    mimeType: file.type || "application/octet-stream",
    imagenBase64: buffer.toString("base64")
  };
  const data = await callAppsScript<{ ok: boolean; url: string }>(payload);
  return data.url;
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    const categoryCompare = String(a.categoria || "").localeCompare(String(b.categoria || ""), "es");
    if (categoryCompare !== 0) return categoryCompare;
    return (Number(a.orden) || 0) - (Number(b.orden) || 0);
  });
}

function uniqueCategories(products: Product[] = [], extraCategories: string[] = []) {
  const defaultCategories = ["Frutales", "Árboles Ornamentales", "Arbustos", "Flores", "Árboles", "Aromáticas"];
  const labels = new Set(extraCategories.length ? extraCategories : defaultCategories);
  extraCategories.forEach((category) => labels.add(category));
  products.forEach((product) => labels.add(product.categoria || ""));
  return [...labels].filter(Boolean);
}

function formatAppsScriptError({ action, error, status }: { action?: string; error?: string; status?: number }) {
  const technical = String(error || "").trim();
  const operation = action ? ` al ejecutar "${action}"` : "";
  const prefix = `No pudimos guardar los cambios${operation}.`;

  if (/accion no soportada|acción no soportada/i.test(technical)) {
    return `${prefix} La Web App de Apps Script publicada no reconoce esa operación. Revisa que el Code.gs actual tenga esa acción y vuelve a implementar una nueva versión.`;
  }

  if (/no autorizado/i.test(technical) || status === 401 || status === 403) {
    return `${prefix} El token de Apps Script no coincide. Revisa que API_TOKEN en Apps Script sea igual a APPSCRIPT_TOKEN en Vercel.`;
  }

  if (/folder|drive|carpeta/i.test(technical)) {
    return `${prefix} No se pudo acceder a la carpeta de Drive para imágenes. Revisa el DRIVE_FOLDER_ID y los permisos de la carpeta.`;
  }

  if (status) {
    return `${prefix} Apps Script respondió con estado ${status}. Revisa la implementación y vuelve a intentar.`;
  }

  return technical ? `${prefix} Detalle: ${technical}` : `${prefix} Revisa la implementación publicada de Apps Script.`;
}
