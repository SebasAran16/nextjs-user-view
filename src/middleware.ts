import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { uncredentialPaths } from "@/utils/arrays/middleware/uncredentialPaths";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { UserRol } from "./types/structs/userRol.enum";
import createMiddleware from "next-intl/middleware";
import { locales } from "./utils/arrays/locales";

export async function middleware(request: NextRequest) {
  const defaultLocale = request.headers.get("accept-language");

  const [, locale, ...segments] = request.nextUrl.pathname.split("/");
  const path = segments.join("/") === "" ? "/" : `/${segments.join("/")}`;

  const isUncredentialPath =
    uncredentialPaths.includes(path) ||
    (path !== "/" && uncredentialPaths.some((item) => path.startsWith(item)));
  const token = request.cookies.get("token")?.value || "";
  const restaurantManager = /\/restaurants\/.*/;

  const dataFromToken = token !== "" ? await getDataFromToken(token) : "";

  if (path !== "/") {
    if (isUncredentialPath && token) {
      return NextResponse.redirect(
        new URL("/dashboard/restaurants", request.nextUrl)
      );
    } else if (!isUncredentialPath && !token) {
      console.log("got here");
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
  }

  const handleI18Routing = createMiddleware({
    locales,
    defaultLocale: "es",
  });
  const response = handleI18Routing(request);

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
