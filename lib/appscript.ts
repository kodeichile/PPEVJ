import { fallbackProducts, type Product } from "./fallback-products";

const APPSCRIPT_URL = process.env.APPSCRIPT_URL;
const APPSCRIPT_TOKEN = process.env.APPSCRIPT_TOKEN;

type ProductInput = Omit<Product, "id" | "fecha_creacion"> & { id?: string };

async function callAppsScript<T>(payload: Record<string, unknown>): Promise<T> {
  if (!APPSCRIPT_URL) throw new Error("APPSCRIPT_URL no configurada");

  const response = await fetch(APPSCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token: APPSCRIPT_TOKEN, ...payload }),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Apps Script respondio ${response.status}`);
  const data = await response.json();
  if (data?.ok === false) throw new Error(data.error || "Error en Apps Script");
  return data as T;
}

export async function listProducts({ includeInactive = false } = {}): Promise<Product[]> {
  if (!APPSCRIPT_URL) return includeInactive ? fallbackProducts : fallbackProducts.filter((p) => p.activo);

  const url = new URL(APPSCRIPT_URL);
  url.searchParams.set("action", "listar");
  if (includeInactive) url.searchParams.set("token", APPSCRIPT_TOKEN || "");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return includeInactive ? fallbackProducts : fallbackProducts.filter((p) => p.activo);
  const data = await response.json();
  const products = Array.isArray(data) ? data : data.products || [];
  return includeInactive ? products : products.filter((p: Product) => p.activo);
}

export async function createProduct(product: ProductInput) {
  return callAppsScript<{ ok: boolean; product: Product }>({ action: "crear", product });
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
