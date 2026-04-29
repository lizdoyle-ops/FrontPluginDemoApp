import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Allow embedding in Front's iframe: CSP uses frame-ancestors; strip X-Frame-Options
 * if another layer sets DENY/SAMEORIGIN (invalid for cross-origin Front parents).
 */
// Next middleware API requires the request object; we only mutate the response.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.delete("x-frame-options");
  return response;
}

export const config = {
  matcher: "/:path*",
};
