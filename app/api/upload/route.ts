import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("imagen");
  if (!(file instanceof File)) return NextResponse.json({ error: "Imagen requerida" }, { status: 400 });
  const url = await uploadProductImage(file);
  return NextResponse.json({ ok: true, url });
}
