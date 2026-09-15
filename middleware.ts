import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isPanel = request.nextUrl.pathname.startsWith("/panel");
  const isWriteApi =
    request.nextUrl.pathname.startsWith("/api/productos") &&
    request.method !== "GET";
  const isUpload = request.nextUrl.pathname.startsWith("/api/upload");

  if ((isPanel || isWriteApi || isUpload) && !request.cookies.get("__session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/ingresar";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/api/productos/:path*", "/api/upload/:path*"]
};
