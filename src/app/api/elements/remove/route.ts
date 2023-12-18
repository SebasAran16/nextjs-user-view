import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Element from "@/models/element";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { id } = await request.json();

    const elementToRemove = await Element.findOne({
      _id: id,
    });

    // TODO Verify user calling is owner

    if (!elementToRemove)
      return NextResponse.json(
        {
          message: "Element to be removed does not exist",
        },
        { status: 400 }
      );

    await elementToRemove.deleteOne();

    return NextResponse.json(
      { message: "Element removed successfully!" },
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
