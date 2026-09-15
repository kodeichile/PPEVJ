import { NextResponse } from "next/server";
import { deactivateProduct, updateProduct } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  return NextResponse.json(await updateProduct(id, await request.json()));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  return NextResponse.json(await deactivateProduct(id));
}
