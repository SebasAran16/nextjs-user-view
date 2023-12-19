import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import View from "@/models/view";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { _id } = await request.json();

    const viewToRemove = await View.findOne({
      _id,
    });

    // TODO Verify user calling is owner

    if (!viewToRemove)
      return NextResponse.json(
        {
          message: "View to be removed does not exist",
        },
        { status: 400 }
      );

    await viewToRemove.deleteOne();

    return NextResponse.json(
      { message: "View removed successfully!" },
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
