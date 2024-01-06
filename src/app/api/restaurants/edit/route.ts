import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import Restaurant from "@/models/restaurant";
import { NextRequest, NextResponse } from "next/server";

const toNotEdit = ["_id", "__v", "created_at", "name"];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const dataToEdit = await request.json();

    const restaurantToEdit = await Restaurant.findOne({
      _id: dataToEdit.id,
    });

    // TODO Verify user calling is owner

    if (!restaurantToEdit)
      return NextResponse.json(
        {
          message: "Restaurant to be edited does not exist",
        },
        { status: 400 }
      );

    for (const key in dataToEdit) {
      if (dataToEdit.hasOwnProperty(key) && !toNotEdit.includes(key)) {
        const value = dataToEdit[key];
        restaurantToEdit[key] = value;
      }
    }

    const editedRestaurant = await restaurantToEdit.save();

    return NextResponse.json(
      {
        message: "Restaurant edited successfully!",
        restaurant: editedRestaurant,
      },
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
