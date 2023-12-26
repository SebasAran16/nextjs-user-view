import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { TokenData } from "@/types/tokenData.interface";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcrypt";
import { cookies } from "next/headers";
import * as jose from "jose";
import { getUserForVariables } from "@/utils/getUserForVariable";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { usernameOrEmail, password } = await request.json();

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username or email not registered",
        },
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword)
      return NextResponse.json(
        { succes: false, message: "Password is not valid" },
        { status: 409 }
      );

    // if (!user.is_verified)
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "User must be verified to log in",
    //     },
    //     { status: 403 }
    //   );

    const tokenData: TokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      rol: user.rol,
    };

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 86400; // 1 day

    const token = await new jose.SignJWT({ ...tokenData })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));

    cookies().set("token", token, {
      httpOnly: true,
      expires: new Date(exp * 1000),
    });

    return NextResponse.json({
      message: "Logged in successfully!",
      success: true,
      tokenData,
      user: getUserForVariables(user),
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
