import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { uncredentialPaths } from "@/utils/arrays/middleware/uncredentialPaths";
import { credentialPaths } from "@/utils/arrays/middleware/credentialPaths";
import { getDataFromToken } from "@/utils/getDataFromToken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isUncredentialPath = uncredentialPaths.includes(path);
  const isCredentialPath = credentialPaths.includes(path);
  const token = request.cookies.get("token")?.value || "";

  const dataFromToken = token !== "" ? await getDataFromToken(token) : "";

  if (isUncredentialPath && token) {
    return NextResponse.redirect(new URL("/restaurants", request.nextUrl));
  } else if (!isUncredentialPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/restaurants/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/kyc-verification/:path*",
  ],
};
