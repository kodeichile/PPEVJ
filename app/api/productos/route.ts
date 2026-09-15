import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ products: await listProducts() });
}

export async function POST(request: Request) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const product = await request.json();
    if (!product?.nombre || !product?.imagen_url) return NextResponse.json({ error: "Nombre e imagen son requeridos" }, { status: 400 });
    return NextResponse.json(await createProduct(product));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo crear el producto" }, { status: 500 });
  }
}
