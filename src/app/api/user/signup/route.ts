import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    const dateCreated = Date.now();

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!existingUser) {
      const dateCreatedAsDate = new Date(dateCreated * 1000);

      const newUser = new User({
        username,
        password,
        email,
        rol: "Client",
        createdDate: dateCreatedAsDate,
      });

      const savedUser = await newUser.save();

      return NextResponse.json(
        { message: "Signup completed!", savedUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Username or Email already in use",
        },
        { status: 409 }
      );
    }
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
