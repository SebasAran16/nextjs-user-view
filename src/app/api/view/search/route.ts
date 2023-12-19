import dbConnect from "@/lib/mongoConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import View from "@/models/view";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { restaurant_id } = await request.json();

    const userToken = cookies().get("token")?.value || "";

    if (userToken === "")
      return NextResponse.json(
        {
          message: "User not logged in",
        },
        { status: 400 }
      );

    const { id } = await getDataFromToken(userToken);

    const views = await View.find({ owner_id: restaurant_id });

    return NextResponse.json({
      success: true,
      message: "Views got successfully!",
      views,
    });
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
