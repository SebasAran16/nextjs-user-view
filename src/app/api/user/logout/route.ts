import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    cookies().set("token", "", { httpOnly: true, expires: new Date(0) });

    return NextResponse.json({ message: "Logout Successful", succes: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message, status: false },
      { status: 500 }
    );
  }
}
