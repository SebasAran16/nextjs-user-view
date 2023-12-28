import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { uncredentialPaths } from "@/utils/arrays/middleware/uncredentialPaths";
import { credentialPaths } from "@/utils/arrays/middleware/credentialPaths";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { UserRol } from "./types/structs/userRol.enum";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isUncredentialPath = uncredentialPaths.includes(path);
  const isCredentialPath = credentialPaths.includes(path);
  const token = request.cookies.get("token")?.value || "";
  const restaurantManager = /\/restaurants\/.*/;

  const dataFromToken = token !== "" ? await getDataFromToken(token) : "";

  if (isUncredentialPath && token) {
    return NextResponse.redirect(new URL("/restaurants", request.nextUrl));
  } else if (!isUncredentialPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  } else if (restaurantManager.test(path)) {
    const restaurantsToken =
      request.cookies.get("restaurantsToken")?.value || false;

    const restaurantsTokenData = restaurantsToken
      ? await getDataFromToken(restaurantsToken)
      : false;

    const restaurantId = path.slice(path.lastIndexOf("/") + 1);
    const isOwner = restaurantsTokenData
      ? restaurantsTokenData.hasOwnProperty(restaurantId)
      : false;

    if (dataFromToken.rol !== UserRol.ADMIN && !isOwner)
      return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/verify-email/:path",
    "/kyc-verification/:path*",
  ],
};
