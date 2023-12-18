import dbConnect from "@/lib/mongoConnection";
import { NextRequest, NextResponse } from "next/server";
import Element from "@/models/element";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { view_id } = await request.json();

    const elements = await Element.find({ view_id });

    if (!elements)
      return NextResponse.json(
        {
          success: false,
          message: "No elements found for view provided",
        },
        { status: 400 }
      );

    return NextResponse.json(
      { success: true, message: "Elements for view found correctly", elements },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting elements",
      },
      { status: 500 }
    );
  }
}
