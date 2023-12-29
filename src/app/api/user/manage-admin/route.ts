import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { getDataFromRequest } from "@/utils/getDataFromRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { newAdminEmail, addAdmin } = await request.json();
    const action = addAdmin ? "added" : "removed";

    const tokenData = await getDataFromRequest(request);

    const adminUser = await User.findOne({
      username: tokenData.username,
    });

    if (!adminUser) {
      return NextResponse.json(
        {
          message: "User expired. Log in again.",
        },
        { status: 400 }
      );
    } else if (adminUser.rol !== "admin") {
      return NextResponse.json(
        {
          message: "User not authorized for operation",
        },
        { status: 401 }
      );
    }

    let user = await User.findOne({ email: newAdminEmail });

    if (addAdmin) {
      user.rol = "admin";
    } else {
      user.rol = "customer";
    }

    await user.save();

    return NextResponse.json(
      { message: `Admin ${action}!`, user },
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
