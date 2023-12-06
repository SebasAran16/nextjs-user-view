import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { getDataFromRequest } from "@/utils/getDataFromRequest";
import { sendEmail } from "@/utils/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();

    const tokenData = await getDataFromRequest(request);

    let user = await User.findOne({
      username: tokenData.username,
    });

    if (!user) throw new Error("User expired, log in again!");

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
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
