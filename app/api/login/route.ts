import { NextResponse } from "next/server";
import { adminAuth, isAllowedAdmin } from "@/lib/firebaseAdmin";
import { sessionCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const { idToken } = await request.json();
  const decoded = await adminAuth().verifyIdToken(idToken);

  if (!isAllowedAdmin(decoded.email)) {
    return NextResponse.json({ error: "Correo no autorizado" }, { status: 403 });
  }

  const expiresIn = 1000 * 60 * 60 * 24 * 10;
  const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresIn / 1000,
    path: "/"
  });
  return response;
}
