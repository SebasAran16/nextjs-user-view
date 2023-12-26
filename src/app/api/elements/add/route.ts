import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Element from "@/models/element";
import { NextRequest, NextResponse } from "next/server";
import ElementTypes from "@/utils/elementsStruct";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const elementToCreate = await request.json();
    console.log(elementToCreate);

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

    const previousHighestPositionElement = await Element.findOne({
      view_id: elementToCreate.view_id,
    })
      .sort({ position: -1 })
      .limit(1);

    const highestElementPosition = previousHighestPositionElement
      ? previousHighestPositionElement.position
      : 0;

    const dateCreatedAsDate = new Date(dateCreated * 1000);
    elementToCreate.position = highestElementPosition + 1;
    elementToCreate.created_at = dateCreatedAsDate;

    const newElement = new Element(elementToCreate);
    const savedElement = await newElement.save();

    return NextResponse.json(
      { message: "Element added successfully!", element: savedElement },
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
