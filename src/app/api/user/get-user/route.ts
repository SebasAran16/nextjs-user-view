import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    return NextResponse.json({
      success: true,
      message: "User got successfully!",
      user,
    });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      { success: false, message: "Error getting user" },
      { status: 500 }
    );
  }
}
