import { NextRequest } from "next/server";
import * as jose from "jose";

export const getDataFromRequest = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (token) {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
      const { payload: tokenData }: any = await jose.jwtVerify(token, secret);

      return tokenData;
    } else {
      return;
    }
  } catch (err: any) {
    console.log("Error getting token data");
    throw new Error(err.message);
  }
};
