import dbConnect from "@/lib/mongoConnection";
import { NextRequest, NextResponse } from "next/server";
import Element from "@/models/element";
import View from "@/models/view";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { url } = await request.json();

    const view = await View.findOne({ url });
    const elements = await Element.find({ view_id: view._id });

    if (!elements)
      return NextResponse.json(
        {
          success: false,
          message: "No elements found for view provided",
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Elements for view found correctly",
        elements,
        view,
      },
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
