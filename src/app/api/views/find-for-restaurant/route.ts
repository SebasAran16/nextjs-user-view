import dbConnect from "@/lib/mongoConnection";
import View from "@/models/view";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { restaurantId } = await request.json();

    const views = await View.find({
      owner_id: restaurantId,
    });

    return NextResponse.json({
      message: "Views found!",
      success: true,
      views: views.length,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
