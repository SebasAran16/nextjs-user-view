import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { UserRol } from "@/types/structs/userRol.enum";
import { getUserForVariables } from "@/utils/getUserForVariable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    const dateCreated = Date.now();

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser)
      return NextResponse.json(
        {
          message: "Username or Email already in use",
        },
        { status: 409 }
      );

    const dateCreatedAsDate = new Date(dateCreated * 1000);

    const newUser = new User({
      username,
      password,
      email,
      createdDate: dateCreatedAsDate,
      rol: UserRol.CUSTOMER,
    });

    const savedUser = await newUser.save();

    return NextResponse.json(
      { message: "Signup completed!", user: getUserForVariables(savedUser) },
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
