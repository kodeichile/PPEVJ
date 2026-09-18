import { NextResponse } from "next/server";
import { revalidateCatalog } from "@/lib/revalidate";
import { createCategory, listCategories, listProducts } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const products = await listProducts({ includeInactive: true, fresh: true });
    return NextResponse.json({ categories: await listCategories(products, { fresh: true }) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudieron cargar las categorías" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const body = await request.json();
    const nombre = String(body?.nombre || "").trim();
    if (!nombre) return NextResponse.json({ error: "Nombre de categoría requerido" }, { status: 400 });
    const result = await createCategory(nombre);
    revalidateCatalog();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo crear la categoría" }, { status: 500 });
  }
}
