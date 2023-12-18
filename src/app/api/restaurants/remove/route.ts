import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Restaurant from "@/models/restaurant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { id } = await request.json();

    const elementToRemove = await Restaurant.findOne({
      _id: id,
    });

    // TODO Verify user calling is owner

    if (!elementToRemove)
      return NextResponse.json(
        {
          message: "Restaurant to be removed does not exist",
        },
        { status: 400 }
      );

    await elementToRemove.deleteOne();

    return NextResponse.json(
      { message: "Restaurant removed successfully!" },
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
