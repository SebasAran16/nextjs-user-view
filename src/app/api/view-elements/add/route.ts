import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Element from "@/models/element";
import { NextRequest, NextResponse } from "next/server";
import ElementTypes from "@/utils/elementsStruct";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const elementToCreate = await request.json();

    const dateCreated = Date.now();

    const existingElement = await Element.findOne({
      name: elementToCreate.elementName,
    });

    if (existingElement)
      return NextResponse.json(
        {
          message: "Element name already on use",
        },
        { status: 409 }
      );

    const dateCreatedAsDate = new Date(dateCreated * 1000);
    elementToCreate.created_at = dateCreatedAsDate;
    elementToCreate.owner_id = "Will get";

    const newElement = new Element(elementToCreate);

    const savedElement = await newElement.save();

    return NextResponse.json(
      { message: "Element added successfully!", savedElement },
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
