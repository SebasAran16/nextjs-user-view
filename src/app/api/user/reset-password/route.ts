import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { token, newPassword } = await request.json();

    const user = await User.findOne({
      forgot_password_token: token,
    });

    if (user.forgot_password_token_expiry < Date.now()) {
      return NextResponse.json(
        { message: "Token has expired", success: false },
        { status: 500 }
      );
    } else if (!user) {
      return NextResponse.json(
        { message: "Invalid Token", success: false },
        { status: 500 }
      );
    }

    user.password = newPassword;
    user.forgot_password_token = undefined;
    user.forgot_password_token_expiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
