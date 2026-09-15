import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const formData = await request.formData();
    const file = formData.get("imagen");
    if (!(file instanceof File)) return NextResponse.json({ error: "Imagen requerida" }, { status: 400 });
    const url = await uploadProductImage(file);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo subir la imagen" }, { status: 500 });
  }
}
