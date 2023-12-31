import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { userDataManagable } from "@/utils/arrays/userData";
import { getDataFromRequest } from "@/utils/getDataFromRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();

    const tokenData = await getDataFromRequest(request);

    let user = await User.findOne({
      username: tokenData.username,
    });

    if (!user)
      return NextResponse.json(
        {
          message: "User expired. Log in again.",
        },
        { status: 400 }
      );

    for (const key in data) {
      if (data.hasOwnProperty(key) && userDataManagable.includes(key)) {
        const value = data[key];
        user[key] = value;
      }
    }

    await user.save();

    return NextResponse.json(
      { message: "User updated!", user },
      { status: 200 }
    );
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
