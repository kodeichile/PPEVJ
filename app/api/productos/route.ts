import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ products: await listProducts() });
}

export async function POST(request: Request) {
  if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const product = await request.json();
  return NextResponse.json(await createProduct(product));
}
