import type { Product } from "./fallback-products";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  details: string;
  image: string;
  icon: string;
  orden?: number;
  activo?: boolean;
};

export const productCategories = ["Todos", "Frutales", "Árboles Ornamentales", "Arbustos", "Flores", "Árboles", "Aromáticas"];

const categoryById = [
  { test: ["limonero", "mandarino", "naranjo", "paltos", "nispero"], category: "Frutales" },
  { test: ["abutilon", "pino-azul", "arrayan", "palmera"], category: "Árboles Ornamentales" }
];

export function productCategory(product: Product) {
  if (product.categoria) return product.categoria;
  const id = product.id.toLowerCase();
  return categoryById.find((entry) => entry.test.some((token) => id.includes(token)))?.category || "Arbustos";
}

export function publicImageUrl(url: string | undefined, fallback = "/catalogo-img/romero-30-cm-29.gif") {
  if (!url) return fallback;
  const value = String(url).trim();
  if (!value) return fallback;

  const driveFileId =
    value.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1] ||
    value.match(/[?&]id=([^&]+)/)?.[1] ||
    value.match(/drive\.google\.com\/uc\?export=view&id=([^&]+)/)?.[1];

  if (driveFileId && value.includes("drive.google.com")) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveFileId)}&sz=w1200`;
  }

  return value;
}

export const moneyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

export const defaultServices: Service[] = [
  {
    slug: "diseno-jardines",
    title: "Diseno de jardines",
    shortTitle: "Diseno de jardines",
    description: "Planificamos espacios verdes funcionales, armonicos y faciles de mantener.",
    details: "Levantamiento, propuesta vegetal, distribucion de senderos, macizos, zonas de descanso e iluminacion.",
    image: "/imagenes-servicios/diseno-jardin-plano.jpg",
    icon: "/catalogo-img/icons/icon-diseno-jardines.svg",
    orden: 1,
    activo: true
  },
  {
    slug: "preparacion",
    title: "Preparacion",
    shortTitle: "Preparacion",
    description: "Preparamos jardines, macizos, terrazas verdes y suelos listos para plantar.",
    details: "Preparacion de terreno, plantacion, sustratos, cesped, jardineras y terminaciones de paisajismo.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    icon: "/catalogo-img/icons/icon-jardineria.svg",
    orden: 2,
    activo: true
  },
  {
    slug: "mantencion",
    title: "Mantencion",
    shortTitle: "Mantencion",
    description: "Poda, limpieza, fertilizacion y cuidado periodico para jardines saludables.",
    details: "Programas mensuales con poda, limpieza, fertilizacion, control preventivo y reposicion de plantas.",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80",
    icon: "/catalogo-img/icons/icon-mantencion.svg",
    orden: 3,
    activo: true
  },
  {
    slug: "riego-automatico",
    title: "Riego automatico",
    shortTitle: "Riego",
    description: "Instalacion y ajuste de sistemas para ahorrar agua y mantener cobertura pareja.",
    details: "Instalacion, sectorizacion, programacion y mantencion de sistemas de riego para optimizar agua.",
    image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=900&q=80",
    icon: "/catalogo-img/icons/icon-riego.svg",
    orden: 4,
    activo: true
  }
];

export const services = defaultServices;
