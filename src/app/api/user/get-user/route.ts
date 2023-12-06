import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    const user = await User.findOne({ username });

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
