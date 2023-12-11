import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Element from "@/models/element";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log(request);

    const dataToEdit = await request.json();

    const elementToEdit = await Element.findOne({
      view_id: dataToEdit.view_id,
      name: dataToEdit.name,
    });

    console.log(elementToEdit);

    // TODO Verify user calling is owner

    if (!elementToEdit)
      return NextResponse.json(
        {
          message: "Element to be edited does not exist",
        },
        { status: 400 }
      );

    const constantData = ["view_id", "name"];

    console.log(dataToEdit);
    for (const key in dataToEdit) {
      if (dataToEdit.hasOwnProperty(key) && !constantData.includes(key)) {
        const value = dataToEdit[key];
        elementToEdit[key] = value;
      }
    }
    console.log(elementToEdit);

    const editedElement = await elementToEdit.save();

    return NextResponse.json(
      { message: "Element editted successfully!", editedElement },
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
