import * as jose from "jose";

export const getDataFromToken = async (token: string | undefined) => {
  try {
    if (!token) return undefined;

    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
    const { payload: tokenData }: any = await jose.jwtVerify(token, secret);

    return tokenData;
  } catch (err: any) {
    console.log("Error getting token data");
    throw new Error(err.message);
  }
};
