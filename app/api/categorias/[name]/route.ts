import { NextResponse } from "next/server";
import { deleteCategory, renameCategory } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const { name } = await params;
    const body = await request.json();
    const nuevoNombre = String(body?.nombre || "").trim();
    if (!nuevoNombre) return NextResponse.json({ error: "Nuevo nombre de categoría requerido" }, { status: 400 });
    return NextResponse.json(await renameCategory(decodeURIComponent(name), nuevoNombre));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo renombrar la categoría" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const { name } = await params;
    return NextResponse.json(await deleteCategory(decodeURIComponent(name)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo eliminar la categoría" }, { status: 500 });
  }
}
