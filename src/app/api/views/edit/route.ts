import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import View from "@/models/view";
import { NextRequest, NextResponse } from "next/server";

const toNotEdit = ["_id", "__v", "created_at"];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const dataToEdit = await request.json();

    const viewToEdit = await View.findOne({
      _id: dataToEdit.id,
    });

    // TODO Verify user calling is owner

    if (!viewToEdit)
      return NextResponse.json(
        {
          message: "View to be edited does not exist",
        },
        { status: 400 }
      );

    for (const key in dataToEdit) {
      if (dataToEdit.hasOwnProperty(key) && !toNotEdit.includes(key)) {
        const value = dataToEdit[key];
        viewToEdit[key] = value;
      }
    }

    const editedView = await viewToEdit.save();

    return NextResponse.json(
      { message: "View editted successfully!", view: editedView },
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
