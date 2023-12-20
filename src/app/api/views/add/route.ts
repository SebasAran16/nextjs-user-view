import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import View from "@/models/view";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { restaurant_id, name, url, image } = await request.json();

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

    const existingViewUrl = await View.findOne({ url });
    const existingViewNameForUser = await View.findOne({ id, name });

    if (existingViewUrl) {
      return NextResponse.json(
        {
          message: "View URL already in use",
        },
        { status: 409 }
      );
    } else if (existingViewNameForUser)
      return NextResponse.json(
        {
          message: "View name already in use",
        },
        { status: 409 }
      );

    const dateCreatedAsDate = new Date(dateCreated * 1000);

    const newView = new View({
      owner_id: restaurant_id,
      name,
      url,
      image,
      created_at: dateCreatedAsDate,
    });

    const savedView = await newView.save();

    return NextResponse.json(
      { message: "View added successfully!", view: savedView },
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
