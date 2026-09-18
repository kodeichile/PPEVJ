import { NextResponse } from "next/server";
import { revalidateCatalog } from "@/lib/revalidate";
import { deactivateProduct, updateProduct } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const { id } = await params;
    const result = await updateProduct(id, await request.json());
    revalidateCatalog();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const { id } = await params;
    const result = await deactivateProduct(id);
    revalidateCatalog();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo eliminar el producto" }, { status: 500 });
  }
}
