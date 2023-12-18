import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Restaurant from "@/models/restaurant";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, image, description } = await request.json();

    const userToken = cookies().get("token")?.value || "";

    if (userToken === "")
      return NextResponse.json(
        {
          message: "User not logged in",
        },
        { status: 400 }
      );

    const { id } = await getDataFromToken(userToken);

    const dateCreated = Date.now();

    const existingRestaurant = await Restaurant.findOne({ name, id });

    if (existingRestaurant) {
      return NextResponse.json(
        {
          message: "Restaurant name already used",
        },
        { status: 409 }
      );
    }

    const dateCreatedAsDate = new Date(dateCreated * 1000);

    const newView = new Restaurant({
      name,
      image,
      description,
      admin_ids: [id],
      created_at: dateCreatedAsDate,
    });

    const savedView = await newView.save();

    return NextResponse.json(
      { message: "Restaurant added successfully!", savedView },
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
