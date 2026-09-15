import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isPanel = request.nextUrl.pathname.startsWith("/panel");

  if (isPanel && !request.cookies.get("__session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/ingresar";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"]
};
