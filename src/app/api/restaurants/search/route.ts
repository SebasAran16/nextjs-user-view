import dbConnect from "@/lib/mongoConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Restaurant from "@/models/restaurant";

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

    const { id } = await getDataFromToken(userToken);

    const restaurants = await Restaurant.find({ admin_ids: id });

    return NextResponse.json({
      success: true,
      message: "Restaurants got successfully!",
      restaurants,
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
