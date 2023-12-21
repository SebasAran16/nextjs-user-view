import dbConnect from "@/lib/mongoConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Restaurant from "@/models/restaurant";
import { RestaurantsToken } from "@/types/restaurantsToken.interface";
import * as jose from "jose";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userToken = cookies().get("token")?.value || "";

    if (userToken === "")
      return NextResponse.json(
        {
          message: "User not logged in",
        },
        { status: 400 }
      );

    const { id, rol } = await getDataFromToken(userToken);

    const restaurants =
      rol === "admin"
        ? await Restaurant.find()
        : await Restaurant.find({ admin_ids: id });

    if (rol !== "admin") {
      const tokenData: RestaurantsToken = {};
      restaurants.forEach((restaurant) => {
        if (restaurant._id) {
          tokenData[restaurant._id] = true;
        }
      });

      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 86400; // 1 day

      const token = await new jose.SignJWT({ ...tokenData })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));

      cookies().set("restaurantsToken", token, {
        httpOnly: true,
        expires: new Date(exp * 1000),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Restaurants got successfully!",
      restaurants,
      rol,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
