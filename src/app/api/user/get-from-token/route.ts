import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { cookies } from "next/headers";
import { getDataFromToken } from "@/utils/getDataFromToken";
import dbConnect from "@/lib/mongoConnection";

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

    const { username } = await getDataFromToken(userToken);

    const user = await User.findOne({
      username,
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
