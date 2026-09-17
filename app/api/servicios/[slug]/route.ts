import { NextResponse } from "next/server";
import { updateService } from "@/lib/appscript";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    if (!(await getSessionUser())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const { slug } = await params;
    return NextResponse.json(await updateService(decodeURIComponent(slug), await request.json()));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el servicio" }, { status: 500 });
  }
}
